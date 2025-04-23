"use client"

import { useState } from "react"
import { Plus, Tag, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/date-picker"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

type Goal = {
    GoalName: string
    Description: string
    Deadline: string
    CompletedAt: string | null
    Status: "open" | "completed"
    CreatedBy: string
    FeatureName: string
}

function DateToString(date: Date | undefined): string {
    if (!date) return ""
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
}

export default function GoalsClient({ goals: initialGoals }: { goals: Goal[] }) {
    const [goals, setGoals] = useState<Goal[]>(initialGoals)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const [newGoalName, setNewGoalName] = useState("")
    const [newGoalDescription, setNewGoalDescription] = useState("")
    const [newGoalFeature, setNewGoalFeature] = useState("")
    const [newGoalDeadline, setNewGoalDeadline] = useState<Date | undefined>(undefined)

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

    const handleCreateGoal = () => {
        if (!newGoalName || !newGoalFeature || !newGoalDeadline) {
            toast.error("Please fill in all required fields")
            return
        }

        const newGoal: Goal = {
            GoalName: newGoalName,
            Description: newGoalDescription,
            Deadline: DateToString(newGoalDeadline),
            CompletedAt: null,
            Status: "open",
            CreatedBy: "Current User", // In a real app, this would come from auth
            FeatureName: newGoalFeature,
        }

        setGoals([...goals, newGoal])
        setIsDialogOpen(false)
        toast.success("Goal created successfully!")

        // Reset form
        setNewGoalName("")
        setNewGoalDescription("")
        setNewGoalFeature("")
        setNewGoalDeadline(undefined)
    }

    const handleGoalNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const words = value.trim().split(/\s+/);

        if (words.length <= 15) {
            setNewGoalName(value);
        }
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value
        const wordCount = value.trim().split(/\s+/).length
        if (wordCount <= 30) {
            setNewGoalDescription(value)
        }
    }


    return (
        <main className="relative z-10 flex-1 p-6">

            {goals.length > 0 ? (
                <div>
                    <Button
                        onClick={() => setIsDialogOpen(true)}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 shadow-lg shadow-blue-900/20 px-6 py-2 mb-8"
                    >
                        <Plus className="mr-2 h-5 w-5" />
                        New Goal
                    </Button>

                    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {goals.map((goal) => (
                            <Card
                                key={goal.GoalName}
                                className="w-full min-h-[220px] flex flex-col border border-slate-800/50 bg-slate-900/50 text-white"
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="flex items-center mb-4 break-words">{goal.GoalName}</CardTitle>
                                            <CardDescription className="mt-1 text-slate-400">
                                                <Badge variant="outline" className="mr-2 border-slate-700 text-slate-300">
                                                    <Tag className="mr-1 h-3 w-3" />
                                                    {goal.FeatureName}
                                                </Badge>
                                                <span className="text-xs">
                                                    <Clock className="inline mr-1 h-3 w-3" />
                                                    Due {formatDate(goal.Deadline)}
                                                </span>
                                            </CardDescription>
                                        </div>
                                        {goal.Status === "open" ? (
                                            <Badge className="ml-auto bg-cyan-700">{getDaysRemaining(goal.Deadline)} days left</Badge>
                                        ) : (
                                            <Badge variant="outline" className="ml-auto border-green-800/50 text-green-400">
                                                Completed
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow overflow-auto">
                                    <p className="text-sm text-slate-400 break-words">{goal.Description}</p>
                                </CardContent>
                                <CardFooter>
                                    <span className="text-xs text-slate-400">{goal.CreatedBy}</span>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            ) : (<div className="mt-16 flex flex-col items-center justify-center">
                <div className="max-w-md text-center mb-8">
                    <h2 className="text-4xl font-bold text-white mb-4 tracking-tighter">No Goals Yet</h2>
                    <p className="text-slate-400 mb-6">
                        You haven't created any goals yet. Create one to start tracking your progress.
                    </p>
                    <Button
                        onClick={() => setIsDialogOpen(true)}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 shadow-lg shadow-blue-900/20 px-6 py-2"
                    >
                        <Plus className="mr-2 h-5 w-5" />
                        Create New Goal
                    </Button>
                </div>
            </div>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                </DialogTrigger>
                <DialogContent
                    onEscapeKeyDown={(e) => {
                        e.preventDefault()
                    }}
                    className="border-none bg-slate-950/50 backdrop-blur-xl text-white shadow-xl shadow-purple-900/10 pointer-events-auto"
                >
                    <DialogHeader>
                        <DialogTitle className="text-xl text-white tracking-tighter">Create New Goal</DialogTitle>
                        <DialogDescription className="text-slate-400 tracking-tight">
                            Add a new goal to track progress on your product features.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="goalName" className="text-slate-300">
                                Goal Name
                            </Label>
                            <Input
                                id="goalName"
                                value={newGoalName}
                                onChange={handleGoalNameChange}
                                placeholder="Enter goal name"
                                className="border-slate-800/50 bg-slate-900/50 text-white focus:border-cyan-500 focus:ring-cyan-500"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description" className="text-slate-300">
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                value={newGoalDescription}
                                onChange={handleDescriptionChange}
                                placeholder="Describe the goal"
                                className="border-slate-800/50 bg-slate-900/50 text-white focus:border-cyan-500 focus:ring-cyan-500"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="deadline" className="text-slate-300">
                                Deadline
                            </Label>
                            <DatePicker value={newGoalDeadline} onChange={setNewGoalDeadline} />
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
                            disabled={!newGoalName || !newGoalFeature || !newGoalDeadline}
                            onClick={handleCreateGoal}
                        >
                            Create
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </main>
    )
}
