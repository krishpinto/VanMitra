import { type NextRequest, NextResponse } from "next/server";
import {
  savePattaHolder,
  getPattaHolders,
  type PattaHolder,
} from "@/lib/firebase";

export async function GET() {
  try {
    const holders = await getPattaHolders();
    return NextResponse.json({ success: true, data: holders });
  } catch (error) {
    console.error("Error fetching patta holders:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch patta holders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "claimNumber",
      "applicantName",
      "applicantAddress",
      "village",
      "district",
      "state",
      "claimType",
      "landArea",
      "landDescription",
      "coordinates",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate coordinates
    if (!body.coordinates.lat || !body.coordinates.lng) {
      return NextResponse.json(
        { success: false, error: "Invalid coordinates provided" },
        { status: 400 }
      );
    }

    const holderData: Omit<PattaHolder, "id"> = {
      claimNumber: body.claimNumber,
      applicantName: body.applicantName,
      applicantAddress: body.applicantAddress,
      village: body.village,
      district: body.district,
      state: body.state,
      claimType: body.claimType,
      landArea: Number.parseFloat(body.landArea),
      landDescription: body.landDescription,
      coordinates: {
        lat: Number.parseFloat(body.coordinates.lat),
        lng: Number.parseFloat(body.coordinates.lng),
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const id = await savePattaHolder(holderData);

    return NextResponse.json({
      success: true,
      data: { id, ...holderData },
      message: "Patta holder added successfully",
    });
  } catch (error) {
    console.error("Error saving patta holder:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save patta holder" },
      { status: 500 }
    );
  }
}
