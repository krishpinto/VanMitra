"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, CheckCircle, AlertCircle, Loader2, Download, Eye } from "lucide-react"
import { useDropzone } from "react-dropzone"

interface UploadedFile {
  id: string
  name: string
  size: number
  status: "uploading" | "processing" | "completed" | "error"
  progress: number
  extractedData?: any
  error?: string
}

export function PDFUploadSection() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      status: "uploading" as const,
      progress: 0,
    }))

    setFiles((prev) => [...prev, ...newFiles])
    setIsProcessing(true)

    // Process files sequentially to avoid overwhelming the AI service
    for (const newFile of newFiles) {
      const originalFile = acceptedFiles.find((f) => f.name === newFile.name)!
      await processFile(newFile, originalFile)
    }

    setIsProcessing(false)
  }, [])

  const processFile = async (fileInfo: UploadedFile, file: File) => {
    try {
      console.log("[v0] Starting file processing:", fileInfo.name)

      // Update to uploading
      setFiles((prev) => prev.map((f) => (f.id === fileInfo.id ? { ...f, status: "uploading", progress: 20 } : f)))

      // Simulate upload progress
      await new Promise((resolve) => setTimeout(resolve, 500))

      setFiles((prev) => prev.map((f) => (f.id === fileInfo.id ? { ...f, status: "processing", progress: 40 } : f)))

      console.log("[v0] Calling AI extraction API...")

      // Call the AI extraction API
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/extract-pdf-data", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (response.ok && result.success) {
        console.log("[v0] Extraction successful:", result)
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileInfo.id
              ? {
                  ...f,
                  status: "completed",
                  progress: 100,
                  extractedData: {
                    recordsCount: result.recordsCount,
                    states: result.states,
                    savedRecords: result.savedRecords,
                    message: result.message,
                  },
                }
              : f,
          ),
        )
      } else {
        throw new Error(result.error || "Processing failed")
      }
    } catch (error) {
      console.error("[v0] File processing error:", error)
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileInfo.id
            ? {
                ...f,
                status: "error",
                progress: 0,
                error: error instanceof Error ? error.message : "Unknown error",
              }
            : f,
        ),
      )
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: true,
    maxSize: 10 * 1024 * 1024, // 10MB limit
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getStatusIcon = (status: UploadedFile["status"]) => {
    switch (status) {
      case "uploading":
      case "processing":
        return <Loader2 className="w-4 h-4 animate-spin text-primary" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-success" />
      case "error":
        return <AlertCircle className="w-4 h-4 text-destructive" />
    }
  }

  const getStatusBadge = (status: UploadedFile["status"]) => {
    switch (status) {
      case "uploading":
        return <Badge variant="secondary">Uploading</Badge>
      case "processing":
        return <Badge variant="secondary">Processing with Gemini AI</Badge>
      case "completed":
        return <Badge className="bg-success text-success-foreground">Completed</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
    }
  }

  const downloadExtractedData = (data: any, fileName: string) => {
    if (data.states && data.states.length > 0) {
      // For multi-state data, create a summary CSV
      const csvContent = createMultiStateCSV(data)
      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${fileName.replace(".pdf", "")}_extracted_${data.recordsCount}_states.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    }
  }

  const createMultiStateCSV = (data: any) => {
    const headers = ["State", "Records Extracted", "Status"]

    const rows = data.states.map((state: string, index: number) => [state, "1", "Saved to Database"])

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    return `# FRA Data Extraction Summary\n# File: ${data.fileName || "Unknown"}\n# Total States: ${data.recordsCount}\n# Extraction Date: ${new Date().toISOString()}\n\n${csvContent}`
  }

  const convertToCSV = (data: any) => {
    const headers = [
      "Date",
      "Year",
      "Month",
      "State",
      "Individual Claims Received",
      "Community Claims Received",
      "Total Claims Received",
      "Individual Titles Distributed",
      "Community Titles Distributed",
      "Total Titles Distributed",
      "Claims Rejected",
      "Total Claims Disposed Off",
      "Percentage Claims Disposed Off",
      "Area Ha IFR Titles Distributed",
      "Area Ha CFR Titles Distributed",
    ]

    const values = [
      data.date || "",
      data.year || "",
      data.month || "",
      data.state || "",
      data.individualClaimsReceived || 0,
      data.communityClaimsReceived || 0,
      data.totalClaimsReceived || 0,
      data.individualTitlesDistributed || 0,
      data.communityTitlesDistributed || 0,
      data.totalTitlesDistributed || 0,
      data.claimsRejected || 0,
      data.totalClaimsDisposedOff || 0,
      data.percentageClaimsDisposedOff || 0,
      data.areaHaIFRTitlesDistributed || 0,
      data.areaHaCFRTitlesDistributed || 0,
    ]

    return headers.join(",") + "\n" + values.join(",")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="w-5 h-5 text-primary" />
          <span>Upload FRA Records (PDF)</span>
          {isProcessing && (
            <Badge variant="secondary" className="ml-auto">
              Processing...
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          {isDragActive ? (
            <p className="text-primary font-medium">Drop the PDF files here...</p>
          ) : (
            <div>
              <p className="text-foreground font-medium mb-2">Drag & drop PDF files here, or click to select</p>
              <p className="text-sm text-muted-foreground mb-2">
                Upload scanned FRA records for AI-powered data extraction
              </p>
              <p className="text-xs text-muted-foreground">
                Supports PDF files up to 10MB. Multiple files can be uploaded simultaneously.
              </p>
            </div>
          )}
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Uploaded Files ({files.length})</h4>
            {files.map((file) => (
              <div key={file.id} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(file.status)}
                    <div>
                      <p className="font-medium text-foreground">{file.name}</p>
                      <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(file.status)}
                    {file.status === "completed" && file.extractedData && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadExtractedData(file.extractedData, file.name)}
                        className="h-7 px-2"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        CSV
                      </Button>
                    )}
                  </div>
                </div>

                {(file.status === "uploading" || file.status === "processing") && (
                  <div className="space-y-2">
                    <Progress value={file.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {file.status === "uploading" ? "Uploading file..." : "Extracting data with Gemini AI..."}
                    </p>
                  </div>
                )}

                {file.status === "completed" && file.extractedData && (
                  <div className="mt-3 p-3 bg-success/10 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-success font-medium">Data extracted successfully!</p>
                      <Eye className="w-4 h-4 text-success" />
                    </div>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">States Processed:</span>
                          <span className="ml-1 font-medium text-success">{file.extractedData.recordsCount}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Records Saved:</span>
                          <span className="ml-1 font-medium text-success">{file.extractedData.recordsCount}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Status:</span>
                          <span className="ml-1 font-medium text-success">Complete</span>
                        </div>
                      </div>
                      {file.extractedData.states && file.extractedData.states.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground mb-1">Extracted States:</p>
                          <div className="flex flex-wrap gap-1">
                            {file.extractedData.states.slice(0, 8).map((state: string, index: number) => (
                              <Badge key={index} variant="secondary" className="text-xs px-1 py-0">
                                {state}
                              </Badge>
                            ))}
                            {file.extractedData.states.length > 8 && (
                              <Badge variant="secondary" className="text-xs px-1 py-0">
                                +{file.extractedData.states.length - 8} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {file.status === "error" && (
                  <div className="mt-3 p-3 bg-destructive/10 rounded-md">
                    <p className="text-sm text-destructive font-medium mb-1">Processing failed</p>
                    <p className="text-xs text-muted-foreground">
                      {file.error || "Please ensure the PDF contains FRA data tables and try again."}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
