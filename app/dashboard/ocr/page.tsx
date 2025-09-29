"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, AlertCircle, Database, BarChart3, FileText } from "lucide-react"
import { PDFUploadSection } from "@/components/pdf-upload-section"
import { ChartBarLabelCustom } from "@/components/chart-bar-label-custom"
import { useData } from "@/lib/data-context"
import { getFRARecords } from "@/lib/firebase"

export default function OCRDashboard() {
    const { refreshData, loading, error } = useData()
    const [lastUpdated, setLastUpdated] = useState<string>("")
    const [uploadedRecords, setUploadedRecords] = useState<any[]>([])

    useEffect(() => {
        setLastUpdated(new Date().toLocaleString())
        loadUploadedRecords()
    }, [])

    const loadUploadedRecords = async () => {
        try {
            const records = await getFRARecords({})
            setUploadedRecords(records)
        } catch (error) {
            console.error("Error loading uploaded records:", error)
        }
    }

    const handleRefresh = async () => {
        await refreshData()
        await loadUploadedRecords()
        setLastUpdated(new Date().toLocaleString())
    }

    return (
        <div className="p-6 space-y-8">
            {/* Error Display */}
            {error && (
                <Card className="border-destructive/50 bg-destructive/5">
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2 text-destructive">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">{error}</span>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Header Actions */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">OCR System</h1>
                    <p className="text-muted-foreground">PDF Upload & Data Extraction</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
            </div>

            {/* Upload Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Records</p>
                                <p className="text-2xl font-bold text-primary">{uploadedRecords.length}</p>
                                <p className="text-xs text-muted-foreground mt-1">From uploaded PDFs</p>
                            </div>
                            <Database className="w-8 h-8 text-primary" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">States Covered</p>
                                <p className="text-2xl font-bold text-success">{new Set(uploadedRecords.map((r) => r.state)).size}</p>
                                <p className="text-xs text-muted-foreground mt-1">Unique states</p>
                            </div>
                            <BarChart3 className="w-8 h-8 text-success" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Latest Upload</p>
                                <p className="text-2xl font-bold text-chart-1">
                                    {uploadedRecords.length > 0 ? new Date(uploadedRecords[0]?.uploadDate).toLocaleDateString() : "N/A"}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">Most recent</p>
                            </div>
                            <FileText className="w-8 h-8 text-chart-1" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* PDF Upload Section */}
            <PDFUploadSection />

            {/* Data Visualization */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>OCR Processing Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartBarLabelCustom />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Uploads</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {uploadedRecords.slice(0, 5).map((record, index) => (
                                <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                                    <div>
                                        <p className="font-medium text-foreground">{record.state}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {record.month} {record.year} • {record.totalClaimsReceived} claims
                                        </p>
                                    </div>
                                    <Badge variant="outline">{new Date(record.uploadDate).toLocaleDateString()}</Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
