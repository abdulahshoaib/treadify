"use client"

import { useState } from "react"
import { Plus, Calendar, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/date-picker"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

type Feature = {
    id: string
    Name: string
    deadline: string
    progress: number
    totalGoals: number
    completedGoals: number
}

function DateToString(date: Date | undefined): string {
    if (!date) return ""
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
}

export default function FeaturesClient({ initialFeatures }: { initialFeatures: Feature[] }) {
    const [features, setFeatures] = useState<Feature[]>(initialFeatures || [])

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newFeatureName, setNewFeatureName] = useState("")
    const [newFeatureDeadline, setNewFeatureDeadline] = useState<Date | undefined>(undefined)

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    const getDaysRemaining = (deadline: string) => {
        const today = new Date()
        const deadlineDate = new Date(deadline)
        const diffTime = deadlineDate.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays
    }

    const handleCreateFeature = () => {
        if (!newFeatureName || !newFeatureDeadline) {
            toast.error("Please fill in all required fields")
            return
        }

        const newFeature: Feature = {
            id: `feature-${features.length + 1}`,
            Name: newFeatureName,
            deadline: DateToString(newFeatureDeadline),
            progress: 0,
            totalGoals: 0,
            completedGoals: 0,
        }

        setFeatures([...features, newFeature])
        setIsDialogOpen(false)
        toast.success("Feature created successfully!")

        // Reset form
        setNewFeatureName("")
        setNewFeatureDeadline(undefined)
    }

    return (
        <main className="relative z-10 flex-1 p-6">
            <div className="flex items-center justify-between mb-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                        Features
                    </h1>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 shadow-lg shadow-blue-900/20 px-6 py-2">
                            <Plus className="mr-2 h-5 w-5" />
                            New Feature
                        </Button>
                    </DialogTrigger>
                    <DialogContent
                        onEscapeKeyDown={(e) => e.preventDefault()}
                        className="border-none bg-slate-950/50 backdrop-blur-xl text-white shadow-xl shadow-purple-900/10 pointer-events-auto"
                    >
                        <DialogHeader>
                            <DialogTitle className="text-xl text-white tracking-tighter">Create New Feature</DialogTitle>
                            <DialogDescription className="text-slate-400 tracking-tight">
                                Add a new feature channel to track progress on your product.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="featureName" className="text-slate-300">
                                    Feature Name
                                </Label>
                                <Input
                                    id="featureName"
                                    value={newFeatureName}
                                    onChange={(e) => setNewFeatureName(e.target.value)}
                                    placeholder="Enter feature name"
                                    className="border-slate-800/50 bg-slate-900/50 text-white focus:border-cyan-500 focus:ring-cyan-500"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="deadline" className="text-slate-300">
                                    Deadline
                                </Label>
                                <DatePicker value={newFeatureDeadline} onChange={setNewFeatureDeadline} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                                className="border-slate-800 bg-transparent text-white hover:bg-red-900/30 hover:text-red-500 hover:border-red-700 select-none"
                            >
                                Cancel
                            </Button>
                            <Button
                                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 select-none"
                                disabled={!newFeatureName || !newFeatureDeadline}
                                onClick={handleCreateFeature}
                            >
                                Create
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {features.map((feature) => (
                    <Card
                        key={feature.id}
                        className="overflow-hidden border-slate-800/50 bg-slate-900/50 text-white"
                    >
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <CardTitle className="flex items-center">{feature.Name}</CardTitle>
                                <Badge
                                    variant={getDaysRemaining(feature.deadline) < 7 ? "destructive" : "secondary"}
                                    className="ml-auto"
                                >
                                    {getDaysRemaining(feature.deadline)} days left
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
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t border-slate-800/50 bg-slate-900/80 px-6 py-3">
                            <div className="flex items-center text-xs text-slate-400">
                                <Calendar className="mr-1 h-4 w-4" />
                                <span>Due {formatDate(feature.deadline)}</span>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </main>
    )
}
