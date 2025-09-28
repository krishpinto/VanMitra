import { type NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { z } from "zod";
import { saveFRARecord } from "@/lib/firebase";
import { google } from "@ai-sdk/google";

const fraDataSchema = z.object({
  reportInfo: z
    .object({
      date: z
        .string()
        .describe("Date of the report in DD.MM.YYYY format")
        .optional(),
      year: z.number().describe("Year of the report as a number").optional(),
      month: z
        .string()
        .describe("Month name or number from the report")
        .optional(),
    })
    .optional(),
  statesData: z
    .array(
      z.object({
        state: z
          .string()
          .describe("State name (normalize to proper case, exclude TOTAL row)"),
        individualClaimsReceived: z
          .number()
          .nullable()
          .describe(
            "Number of individual forest rights claims received. Use null for NA/NR values"
          ),
        communityClaimsReceived: z
          .number()
          .nullable()
          .describe(
            "Number of community forest rights claims received. Use null for NA/NR values"
          ),
        totalClaimsReceived: z
          .number()
          .nullable()
          .describe("Total claims received. Use null for NA/NR values"),
        individualTitlesDistributed: z
          .number()
          .nullable()
          .describe(
            "Number of individual forest rights titles distributed. Use null for NA/NR values"
          ),
        communityTitlesDistributed: z
          .number()
          .nullable()
          .describe(
            "Number of community forest rights titles distributed. Use null for NA/NR values"
          ),
        totalTitlesDistributed: z
          .number()
          .nullable()
          .describe("Total titles distributed. Use null for NA/NR values"),
        areaHaIndividual: z
          .number()
          .nullable()
          .describe(
            "Area in hectares for Individual Forest Rights. Use null for NA/NR values"
          ),
        areaHaCommunity: z
          .number()
          .nullable()
          .describe(
            "Area in hectares for Community Forest Rights. Use null for NA/NR values"
          ),
        areaHaTotal: z
          .number()
          .nullable()
          .describe("Total area in hectares. Use null for NA/NR values"),
      })
    )
    .describe("Array of all states data from the table"),
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are supported" },
        { status: 400 }
      );
    }

    // Convert file to base64 for Gemini
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    console.log("[v0] Processing PDF with Gemini AI for multiple states...");

    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: fraDataSchema,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are an expert at extracting Forest Rights Act (FRA) data from government PDF documents.

CRITICAL INSTRUCTIONS:
1. Extract data from ALL STATES in the table - this PDF contains multiple states (typically 20+ states)
2. Look for the state-wise table with columns: "States/UT", "No. of Claims received", "No. of Titles Distributed", "Extent of Forest land"
3. For each state row, extract ALL the numerical data
4. HANDLE NA/NR VALUES: Convert "NA/NR", "NA", "NR", or similar to null (not 0)
5. EXCLUDE the "TOTAL" row - only extract individual state data
6. Extract numerical values without commas (e.g., "1,23,456" becomes 123456)
7. State names should be properly formatted (e.g., "Andhra Pradesh", "Chhattisgarh", "Madhya Pradesh")

The table structure typically has:
- S.No. | States/UT | Individual Claims | Community Claims | Total Claims | Individual Titles | Community Titles | Total Titles | Individual Area | Community Area | Total Area

Extract report date/year/month from the document header if available.

Return ALL states data - do not limit to just one state. Each state should be a separate object in the statesData array.`,
            },
            {
              type: "file",
              data: base64,
              mediaType: "application/pdf",
            },
          ],
        },
      ],
    });

    console.log(
      "[v0] Extracted data for",
      object.statesData?.length || 0,
      "states"
    );

    const savedRecords = [];
    const reportInfo = object.reportInfo || {};

    for (const stateData of object.statesData || []) {
      // Skip if state name is missing or is "TOTAL"
      if (!stateData.state || stateData.state.toUpperCase().includes("TOTAL")) {
        continue;
      }

      // Create complete record for each state
      const completeRecord = {
        date: reportInfo.date || new Date().toLocaleDateString("en-GB"),
        year: reportInfo.year || new Date().getFullYear(),
        month:
          reportInfo.month ||
          new Date().toLocaleDateString("en-US", { month: "long" }),
        state: stateData.state,
        individualClaimsReceived: stateData.individualClaimsReceived ?? 0,
        communityClaimsReceived: stateData.communityClaimsReceived ?? 0,
        totalClaimsReceived: stateData.totalClaimsReceived ?? 0,
        individualTitlesDistributed: stateData.individualTitlesDistributed ?? 0,
        communityTitlesDistributed: stateData.communityTitlesDistributed ?? 0,
        totalTitlesDistributed: stateData.totalTitlesDistributed ?? 0,
        claimsRejected: 0, // Not available in this table format
        totalClaimsDisposedOff: 0, // Not available in this table format
        percentageClaimsDisposedOff: 0, // Not available in this table format
        areaHaIFRTitlesDistributed: stateData.areaHaIndividual ?? 0,
        areaHaCFRTitlesDistributed: stateData.areaHaCommunity ?? 0,
        // Add metadata
        uploadDate: new Date().toISOString(),
        fileName: file.name,
        fileSize: file.size,
      };

      // Save to Firebase
      try {
        const recordId = await saveFRARecord(completeRecord);
        savedRecords.push({ state: stateData.state, recordId });
        console.log(
          "[v0] Saved",
          stateData.state,
          "data to Firebase with ID:",
          recordId
        );
      } catch (firebaseError) {
        console.error(
          "[v0] Firebase save failed for",
          stateData.state,
          ":",
          firebaseError
        );
      }
    }

    return NextResponse.json({
      success: true,
      recordsCount: savedRecords.length,
      states: savedRecords.map((r) => r.state),
      savedRecords,
      message: `Successfully extracted and saved FRA data for ${savedRecords.length} states`,
    });
  } catch (error) {
    console.error("[v0] Error processing PDF:", error);

    if (error instanceof Error) {
      if (error.message.includes("model")) {
        return NextResponse.json(
          { error: "AI model error. Please try again." },
          { status: 500 }
        );
      }
      if (error.message.includes("quota") || error.message.includes("rate")) {
        return NextResponse.json(
          { error: "Service temporarily unavailable. Please try again later." },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      {
        error:
          "Failed to process PDF. Please ensure the file contains FRA data tables.",
      },
      { status: 500 }
    );
  }
}
