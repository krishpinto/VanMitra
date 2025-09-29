"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { BarChart3, Upload, FileText, TreePine, Users, Building, ArrowRight } from "lucide-react"

export default function HomePage() {
  const router = useRouter()

  const handleEnterDashboard = () => {
    router.push("/dashboard/analytics")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-xl">
              <TreePine className="w-12 h-12 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">FRA Monitoring System</h1>
          <p className="text-xl text-muted-foreground mb-2">Ministry of Tribal Affairs, Government of India</p>
          <p className="text-lg text-muted-foreground">Forest Rights Act Claims & Records Management</p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-chart-1/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-chart-1" />
              </div>
              <CardTitle className="text-xl">Analytics Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center mb-4">
                Comprehensive analytics and visualization of FRA claims, titles distribution, and forest land
                recognition across all states.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="outline">Interactive Maps</Badge>
                <Badge variant="outline">State-wise Data</Badge>
                <Badge variant="outline">Real-time Charts</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-chart-2/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-chart-2" />
              </div>
              <CardTitle className="text-xl">OCR System</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center mb-4">
                Advanced PDF upload and data extraction system for processing FRA documents and automatically updating
                the database.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="outline">PDF Processing</Badge>
                <Badge variant="outline">Data Extraction</Badge>
                <Badge variant="outline">Auto Upload</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-chart-3/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-chart-3" />
              </div>
              <CardTitle className="text-xl">Titles Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center mb-4">
                Complete patta holder management system with location mapping, claim tracking, and comprehensive record
                keeping.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="outline">Patta Holders</Badge>
                <Badge variant="outline">Location Mapping</Badge>
                <Badge variant="outline">Claim Tracking</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistics Preview */}
        <Card className="mb-12 bg-primary/5 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">System Overview</CardTitle>
            <p className="text-muted-foreground">Current FRA implementation status</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-6 h-6 text-primary mr-2" />
                  <span className="text-2xl font-bold text-primary">4.2M+</span>
                </div>
                <p className="text-sm text-muted-foreground">Claims Received</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <FileText className="w-6 h-6 text-success mr-2" />
                  <span className="text-2xl font-bold text-success">2.1M+</span>
                </div>
                <p className="text-sm text-muted-foreground">Titles Distributed</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <TreePine className="w-6 h-6 text-chart-1 mr-2" />
                  <span className="text-2xl font-bold text-chart-1">5.2M</span>
                </div>
                <p className="text-sm text-muted-foreground">Hectares Recognized</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Building className="w-6 h-6 text-warning mr-2" />
                  <span className="text-2xl font-bold text-warning">28</span>
                </div>
                <p className="text-sm text-muted-foreground">States Covered</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Button */}
        <div className="text-center">
          <Button
            onClick={handleEnterDashboard}
            size="lg"
            className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
          >
            Enter Dashboard
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">Access the complete FRA monitoring and management system</p>
        </div>

        {/* Footer */}
        <footer className="border-t border-border pt-8 mt-16">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2025 Ministry of Tribal Affairs, Government of India</p>
            <p className="mt-1">Forest Rights Act Monitoring System</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
