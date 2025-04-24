"use client"

import { useState } from "react"
import { Plus, Clock, CheckCircle, Filter } from "lucide-react"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Goal = {
    id: string
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

export default function GoalsClient(goalData: any) {
    const [goals, setGoals] = useState<Goal[]>(goalData ?? [])
    const [filterStatus, setFilterStatus] = useState<string>("all")

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newGoalName, setNewGoalName] = useState("")
    const [newGoalDescription, setNewGoalDescription] = useState("")
    const [newGoalDeadline, setNewGoalDeadline] = useState<Date | undefined>(undefined)

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
    }

    const getDaysRemaining = (deadline: string) => {
        const today = new Date()
        const deadlineDate = new Date(deadline)
        const diffTime = deadlineDate.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays
    }

    const handleCreateGoal = async () => {
        const payload = {
            name: newGoalName,
            description: newGoalDescription,
            deadline: newGoalDeadline,
        };

        try {
            const res = await fetch("/api/create-goal", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.error || "Something went wrong");
            toast.success("Goal created successfully!");
            window.location.reload();
        } catch (error: any) {
            toast.error("Error creating goal: " + error.message);
        }
    }

    const goalsArray = Array.isArray(goals)
        ? goals
        : Object.values(goals).find(val => Array.isArray(val)) || [];

    const filteredGoals = goalsArray.filter((goal) => {
        if (filterStatus !== "all" && goal.Status !== filterStatus) {
            return false;
        }
        return true;
    })

    return (
        <main className="relative z-10 flex-1 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">

                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                    Goals
                </h1>
                <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex items-center">
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-[140px] border-slate-800/50 bg-slate-900/50 text-white tracking-tighter text-left">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Filter" />
                            </SelectTrigger>
                            <SelectContent className="border-slate-800 bg-slate-900 text-white">
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 shadow-lg shadow-blue-900/20 px-6 py-2">
                                <Plus className="mr-2 h-5 w-5" />
                                New Goal
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="border-none bg-slate-950/50 backdrop-blur-xl text-white shadow-xl shadow-purple-900/10 pointer-events-auto">
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
                                        onChange={(e) => setNewGoalName(e.target.value)}
                                        placeholder="Enter goal name"
                                        className="border-slate-800/50 bg-slate-900/50 text-white"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description" className="text-slate-300">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={newGoalDescription}
                                        onChange={(e) => setNewGoalDescription(e.target.value)}
                                        placeholder="Describe the goal"
                                        className="border-slate-800/50 bg-slate-900/50 text-white"
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
                                    className="border-slate-800 bg-transparent text-white hover:bg-red-900/30 hover:text-red-500 hover:border-red-700"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0"
                                    disabled={!newGoalName || !newGoalDeadline}
                                    onClick={handleCreateGoal}
                                >
                                    Create
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {
                filteredGoals.length === 0 ? (
                    <div className="mt-16 flex flex-col items-center justify-center">
                        <div className="max-w-md text-center mb-8">
                            <h2 className="text-4xl font-bold text-white mb-4 tracking-tighter">No Goals Found</h2>
                            <p className="text-slate-400 mb-6">
                                No goals match your current filters. Try changing your filter criteria or create a new goal.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredGoals.map((goal) => (
                            <Card
                                key={goal.id}
                                className="flex flex-col h-full overflow-hidden border-slate-800/50 bg-slate-900/50 text-white"
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="flex items-center">
                                                {goal.Status === "completed" && (
                                                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                                                )}
                                                {goal.GoalName}
                                            </CardTitle>
                                            <CardDescription className="mt-1 text-slate-400">
                                                <span className="text-xs">
                                                    <Clock className="inline mr-1 h-3 w-3" />
                                                    Due {formatDate(goal.Deadline)}
                                                </span>
                                            </CardDescription>
                                        </div>
                                        {goal.Status === "open" ? (
                                            <Badge
                                                variant={getDaysRemaining(goal.Deadline) < 3 ? "destructive" : "secondary"}
                                                className="ml-auto bg-cyan-800 text-white"
                                            >
                                                {getDaysRemaining(goal.Deadline)} days left
                                            </Badge>
                                        ) : (
                                            <Badge
                                                variant="outline"
                                                className="ml-auto border-green-800/50 text-green-400"
                                            >
                                                Completed
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>

                                <CardContent className="">
                                    <p className="text-sm text-slate-400">{goal.Description}</p>
                                </CardContent>

                                <CardFooter className="flex justify-between border-t border-slate-800/50 bg-slate-900/80 px-6 py-3">
                                    <div className="flex items-center">
                                        <Avatar className="h-6 w-6 mr-2">
                                            <AvatarImage src={`https://avatar.vercel.sh/${goal.CreatedBy}`} />
                                            <AvatarFallback className="bg-slate-700 text-slate-200">
                                                {getInitials(goal.CreatedBy)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="text-xs text-slate-400">{goal.CreatedBy}</span>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )
            }
        </main >
    )
}
