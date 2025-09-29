"use client"

import type React from "react"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { BarChart3, Upload, FileText, Menu, TreePine, Home, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
    {
        name: "Analytics",
        href: "/dashboard/analytics",
        icon: BarChart3,
        description: "View comprehensive FRA analytics and reports",
    },
    {
        name: "OCR System",
        href: "/dashboard/ocr",
        icon: Upload,
        description: "Upload and process PDF documents",
    },
    {
        name: "Titles Management",
        href: "/dashboard/titles",
        icon: FileText,
        description: "Manage patta holders and land records",
    },
]

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const pathname = usePathname()

    const currentPage = navigation.find((item) => pathname === item.href)

    return (
        <div className="min-h-screen bg-background">
            {/* Mobile sidebar */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetContent side="left" className="w-64 p-0">
                    <SidebarContent pathname={pathname} onNavigate={() => setSidebarOpen(false)} />
                </SheetContent>
            </Sheet>

            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
                <SidebarContent pathname={pathname} />
            </div>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top navigation bar */}
                <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                    <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                        <Menu className="h-5 w-5" />
                    </Button>

                    {/* Breadcrumb */}
                    <div className="flex items-center gap-x-2 text-sm">
                        <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                            <Home className="h-4 w-4" />
                        </Link>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Dashboard</span>
                        {currentPage && (
                            <>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium text-foreground">{currentPage.name}</span>
                            </>
                        )}
                    </div>

                    <div className="flex flex-1 justify-end">
                        <div className="text-right">
                            <div className="text-sm font-medium text-foreground">FRA Monitoring System</div>
                            <div className="text-xs text-muted-foreground">Ministry of Tribal Affairs</div>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <main className="flex-1">{children}</main>
            </div>
        </div>
    )
}

function SidebarContent({
    pathname,
    onNavigate,
}: {
    pathname: string
    onNavigate?: () => void
}) {
    return (
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-sidebar px-6 pb-4">
            {/* Logo */}
            <div className="flex h-16 shrink-0 items-center">
                <Link href="/" className="flex items-center gap-x-3" onClick={onNavigate}>
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <TreePine className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="text-lg font-semibold text-sidebar-foreground">FRA System</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                        <div className="text-xs font-semibold leading-6 text-sidebar-foreground/60 uppercase tracking-wide">
                            Dashboard
                        </div>
                        <ul role="list" className="mt-2 space-y-1">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            onClick={onNavigate}
                                            className={cn(
                                                "group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-medium transition-all",
                                                isActive
                                                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                                                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                            )}
                                        >
                                            <item.icon
                                                className={cn(
                                                    "h-5 w-5 shrink-0 transition-colors",
                                                    isActive ? "text-sidebar-accent-foreground" : "text-sidebar-foreground/60",
                                                )}
                                            />
                                            <div className="flex flex-col">
                                                <span>{item.name}</span>
                                                <span className="text-xs text-sidebar-foreground/60 mt-0.5">{item.description}</span>
                                            </div>
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </li>
                </ul>
            </nav>

            {/* Footer */}
            <div className="border-t border-sidebar-border pt-4">
                <div className="text-xs text-sidebar-foreground/60">
                    <div>© 2025 Ministry of Tribal Affairs</div>
                    <div className="mt-1">Government of India</div>
                </div>
            </div>
        </div>
    )
}
