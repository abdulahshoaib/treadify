"use client"

import { useState } from "react"
import { BarChart3, Calendar, Download, PieChart, TrendingUp, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { toast } from "sonner"

type Feature = {
    id: string
    name: string
    deadline: string
    progress: number
    totalGoals: number
    completedGoals: number
}

type ProductMetrics = {
    totalFeatures: number
    completedFeatures: number
    totalGoals: number
    completedGoals: number
    overallProgress: number
    upcomingDeadlines: {
        featureId: string
        featureName: string
        deadline: string
        daysRemaining: number
    }[]
}

export default function ReportClient({ featureData }: { featureData: Feature[] | undefined }) {
    const [features] = useState<Feature[]>(featureData ?? [])

    let productMetrics: ProductMetrics | null = null
    if (Array.isArray(features)) {
        productMetrics = {
            totalFeatures: features.length,
            completedFeatures: features.filter((f) => f.progress === 100).length,
            totalGoals: features.reduce((acc, f) => acc + f.totalGoals, 0),
            completedGoals: features.reduce((acc, f) => acc + f.completedGoals, 0),
            overallProgress: Math.round(features.reduce((acc, f) => acc + f.progress, 0) / features.length || 0),
            upcomingDeadlines: features
                .map((f) => ({
                    featureId: f.id,
                    featureName: f.name,
                    deadline: f.deadline,
                    daysRemaining: getDaysRemaining(f.deadline),
                }))
                .filter((d) => d.daysRemaining > 0)
                .sort((a, b) => a.daysRemaining - b.daysRemaining)
                .slice(0, 3),
        }
    } else {
        return (<h1 className="text-white">Loading...</h1>)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    function getDaysRemaining(deadline: string) {
        const today = new Date()
        const deadlineDate = new Date(deadline)
        const diffTime = deadlineDate.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays
    }

    const handleExportPDF = () => {
        if (!productMetrics) return

        const doc = new jsPDF()

        doc.setFontSize(18)
        doc.text("Product Metrics Report", 14, 20)

        doc.setFontSize(12)
        const basicStats = [
            `Total Features: ${productMetrics.totalFeatures}`,
            `Completed Features: ${productMetrics.completedFeatures}`,
            `Total Goals: ${productMetrics.totalGoals}`,
            `Completed Goals: ${productMetrics.completedGoals}`,
            `Overall Progress: ${productMetrics.overallProgress}%`
        ]
        basicStats.forEach((line, index) => {
            doc.text(line, 14, 35 + index * 8)
        })

        const tableStartY = 35 + basicStats.length * 8 + 10

        if (productMetrics.upcomingDeadlines.length > 0) {
            autoTable(doc, {
                startY: tableStartY,
                head: [["No.", "Feature Name", "Deadline", "Days Remaining"]],
                body: productMetrics.upcomingDeadlines.map((d, i) => [
                    i + 1,
                    d.featureName,
                    new Date(d.deadline).toLocaleDateString(),
                    `${d.daysRemaining} days`
                ]),
                styles: { halign: 'left' },
                headStyles: { fillColor: [22, 160, 133] },
            })
        }

        doc.save("report.pdf")
        toast.success("PDF report exported successfully!")
    }

    return (
        <main className="relative z-10 flex-1 p-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                    Report
                </h1>

                <Button
                    onClick={handleExportPDF}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 shadow-lg shadow-blue-900/20 px-6 py-2"
                >
                    <Download className="mr-2 h-5 w-5" />
                    Export Report
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card className="border-slate-800/50 bg-slate-900/50 text-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Overall Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold">{productMetrics.overallProgress}%</div>
                            <TrendingUp className="h-4 w-4 text-cyan-400" />
                        </div>
                        <Progress
                            value={productMetrics.overallProgress}
                            className="h-2 mt-2 bg-slate-800"
                            indicatorClassName="bg-gradient-to-r from-cyan-500 to-blue-600"
                        />
                    </CardContent>
                </Card>

                <Card className="border-slate-800/50 bg-slate-900/50 text-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Features</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold">
                                {productMetrics.completedFeatures}/{productMetrics.totalFeatures}
                            </div>
                            <BarChart3 className="h-4 w-4 text-cyan-400" />
                        </div>
                        <Progress
                            value={(productMetrics.completedFeatures / productMetrics.totalFeatures) * 100}
                            className="h-2 mt-2 bg-slate-800"
                            indicatorClassName="bg-gradient-to-r from-cyan-500 to-blue-600"
                        />
                    </CardContent>
                </Card>

                <Card className="border-slate-800/50 bg-slate-900/50 text-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Goals</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold">
                                {productMetrics.completedGoals}/{productMetrics.totalGoals}
                            </div>
                            <PieChart className="h-4 w-4 text-cyan-400" />
                        </div>
                        <Progress
                            value={(productMetrics.completedGoals / productMetrics.totalGoals) * 100}
                            className="h-2 mt-2 bg-slate-800"
                            indicatorClassName="bg-gradient-to-r from-cyan-500 to-blue-600"
                        />
                    </CardContent>
                </Card>

                <Card className="border-slate-800/50 bg-slate-900/50 text-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Next Deadline</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {productMetrics.upcomingDeadlines.length > 0 ? (
                            <div>
                                <div className="flex items-center justify-between">
                                    <div className="text-2xl font-bold">{productMetrics.upcomingDeadlines[0].daysRemaining} days</div>
                                    <Calendar className="h-4 w-4 text-cyan-400" />
                                </div>
                                <div className="text-sm text-slate-400 mt-2">
                                    {productMetrics.upcomingDeadlines[0].featureName} -{" "}
                                    {formatDate(productMetrics.upcomingDeadlines[0].deadline)}
                                </div>
                            </div>
                        ) : (
                            <div className="text-slate-400">No upcoming deadlines</div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="features" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-900/50 border border-slate-800/50">
                    <TabsTrigger value="features" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white">
                        Feature Progress
                    </TabsTrigger>
                    <TabsTrigger value="deadlines" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white">
                        Upcoming Deadlines
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="features" className="mt-0">
                    <div className="grid gap-4">
                        {features.map((feature) => (
                            <Card key={feature.id} className="overflow-hidden border-slate-800/50 bg-slate-900/50 text-white">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-center">
                                        <CardTitle>{feature.name}</CardTitle>
                                        <Badge
                                            variant={
                                                feature.progress === 100
                                                    ? "outline"
                                                    : getDaysRemaining(feature.deadline) < 7
                                                        ? "destructive"
                                                        : "secondary"
                                            }
                                            className={feature.progress === 100 ? "border-green-700/50 text-green-400" : ""}
                                        >
                                            {feature.progress === 100 ? "Completed" : `${getDaysRemaining(feature.deadline)} days left`}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-slate-400">Progress</span>
                                        <span className="text-sm font-medium">{feature.progress}%</span>
                                    </div>
                                    <Progress
                                        value={feature.progress}
                                        className="h-2 bg-slate-800"
                                        indicatorClassName="bg-gradient-to-r from-cyan-500 to-blue-600"
                                    />

                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="flex items-center text-sm text-slate-400">
                                            <BarChart3 className="mr-1 h-4 w-4" />
                                            <span>
                                                {feature.completedGoals}/{feature.totalGoals} goals completed
                                            </span>
                                        </div>
                                        <div className="flex items-center text-sm text-slate-400">
                                            <Calendar className="mr-1 h-4 w-4" />
                                            <span>Due {formatDate(feature.deadline)}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="deadlines" className="mt-0">
                    <Card className="border-slate-800/50 bg-slate-900/50 text-white">
                        <CardHeader>
                            <CardTitle>Upcoming Deadlines</CardTitle>
                            <CardDescription className="text-slate-400">Features ordered by closest deadline</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {features
                                    .filter((f) => f.progress < 100)
                                    .sort((a, b) => getDaysRemaining(a.deadline) - getDaysRemaining(b.deadline))
                                    .map((feature) => (
                                        <div
                                            key={feature.id}
                                            className="flex items-center justify-between p-3 bg-slate-800/30 rounded-md border border-slate-800/50"
                                        >
                                            <div>
                                                <h3 className="font-medium">{feature.name}</h3>
                                                <div className="flex items-center mt-1 text-sm text-slate-400">
                                                    <Calendar className="mr-1 h-4 w-4" />
                                                    <span>{formatDate(feature.deadline)}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <Badge variant={getDaysRemaining(feature.deadline) < 7 ? "destructive" : "secondary"}>
                                                    {getDaysRemaining(feature.deadline)} days left
                                                </Badge>
                                                <span className="text-sm text-slate-400 mt-1">{feature.progress}% complete</span>
                                            </div>
                                        </div>
                                    ))}

                                {features.filter((f) => f.progress < 100).length === 0 && (
                                    <div className="text-center py-6 text-slate-400">
                                        <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                        <p>All features are completed!</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </main>
    )
}
