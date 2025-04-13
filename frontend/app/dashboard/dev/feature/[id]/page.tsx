"use client"

import { useState } from "react"
import { CalendarClock, GitBranch, GitCommit, Github } from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample data for demonstration
const initialFeatureChannel = {
    id: "feat-1",
    name: "User Authentication",
    description: "Implement secure login and registration system",
    deadline: "Nov 20, 2023",
    progress: 68,
    repo: "treadify/mobile-app",
}

const initialGoals = [
    {
        id: "goal-1",
        name: "Implement login form",
        description: "Create a responsive login form with validation",
        progress: 100,
        status: "completed" as const,
        deadline: "2023-11-15",
    },
    {
        id: "goal-2",
        name: "Set up authentication API",
        description: "Implement backend API endpoints for authentication",
        progress: 75,
        status: "in-progress" as const,
        deadline: "2023-11-20",
    },
    {
        id: "goal-3",
        name: "Add password reset functionality",
        description: "Create password reset flow with email verification",
        progress: 30,
        status: "in-progress" as const,
        deadline: "2023-11-25",
    },
]

// Sample commits for the developer
const initialCommits = [
    {
        id: "commit-1",
        hash: "a1b2c3d",
        message: "Added login form with validation",
        timestamp: "2023-11-08T10:15:00Z",
        submitted: true,
        goalId: "goal-1",
        status: "approved" as "approved" | "rejected" | "pending",
        comment: "Great work! Clean implementation.",
    },
    {
        id: "commit-2",
        hash: "e4f5g6h",
        message: "Implemented user authentication API endpoints",
        timestamp: "2023-11-10T14:30:00Z",
        submitted: true,
        goalId: "goal-2",
        status: "pending" as "approved" | "rejected" | "pending",
        comment: "",
    },
    {
        id: "commit-3",
        hash: "i7j8k9l",
        message: "Added JWT token generation",
        timestamp: "2023-11-11T09:45:00Z",
        submitted: false,
        goalId: null,
        status: null,
        comment: "",
    },
    {
        id: "commit-4",
        hash: "m0n1o2p",
        message: "Fixed password validation bug",
        timestamp: "2023-11-12T11:20:00Z",
        submitted: false,
        goalId: null,
        status: null,
        comment: "",
    },
]

export default function DevFeatureChannelPage() {
    const [featureChannel] = useState(initialFeatureChannel)
    const [goals] = useState(initialGoals)
    const [commits, setCommits] = useState(initialCommits)
    const [selectedGoal, setSelectedGoal] = useState<(typeof initialGoals)[0] | null>(null)
    const [selectedCommit, setSelectedCommit] = useState<string | null>(null)
    const [isSubmitCommitDialogOpen, setIsSubmitCommitDialogOpen] = useState(false)

    const handleSubmitCommit = () => {
        if (!selectedCommit || !selectedGoal) return

        // Find the commit and update it
        const updatedCommits = commits.map((commit) => {
            if (commit.id === selectedCommit) {
                return {
                    ...commit,
                    submitted: true,
                    goalId: selectedGoal.id,
                    status: "pending" as const,
                }
            }
            return commit
        })

        setCommits(updatedCommits)
        setSelectedCommit(null)
        setSelectedGoal(null)
        setIsSubmitCommitDialogOpen(false)
    }

    // Get unsubmitted commits
    const unsubmittedCommits = commits.filter((commit) => !commit.submitted)

    const activeGoals = goals.filter((goal) => goal.status !== "completed")
    const completedGoals = goals.filter((goal) => goal.status === "completed")

    return (
        <div className="flex min-h-screen flex-col bg-black text-white">
            {/* Background gradient effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] left-[15%] w-[40rem] h-[40rem] rounded-full bg-purple-600/30 blur-3xl opacity-20"></div>
                <div className="absolute bottom-[20%] right-[10%] w-[35rem] h-[35rem] rounded-full bg-blue-600/30 blur-3xl opacity-20"></div>
                <div className="absolute top-[60%] left-[40%] w-[30rem] h-[30rem] rounded-full bg-cyan-600/30 blur-3xl opacity-20"></div>
                <div className="absolute top-[30%] right-[25%] w-[25rem] h-[25rem] rounded-full bg-green-600/30 blur-3xl opacity-20"></div>
            </div>

            <DashboardHeader userName="Jamie Smith" userRole="Developer" />
            <main className="relative z-10 flex-1 p-6">
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                            {featureChannel.name}
                        </h1>
                    </div>

                    <div className="mt-8 grid gap-6 md:grid-cols-3">
                        <Card className="border-slate-800/30 bg-slate-900/30 backdrop-blur-md shadow-xl">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-white">Feature Progress</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-400">Progress</span>
                                        <span className="font-medium text-white">{featureChannel.progress}%</span>
                                    </div>
                                    <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-800/80 p-0.5">
                                        <div
                                            className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_5px_rgba(0,255,255,0.5)]"
                                            style={{ width: `${featureChannel.progress}%` }}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-slate-800/30 bg-slate-900/30 backdrop-blur-md shadow-xl">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-white">GitHub Repository</CardTitle>
                            </CardHeader>
                            <CardContent className="flex items-center space-x-3">
                                <div className="bg-slate-800/80 p-2.5 rounded-md">
                                    <Github className="h-5 w-5 text-cyan-400" />
                                </div>
                                <span className="text-slate-300">{featureChannel.repo}</span>
                            </CardContent>
                        </Card>
                        <Card className="border-slate-800/30 bg-slate-900/30 backdrop-blur-md shadow-xl">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-white">Deadline</CardTitle>
                            </CardHeader>
                            <CardContent className="flex items-center space-x-3">
                                <div className="bg-slate-800/80 p-2.5 rounded-md">
                                    <CalendarClock className="h-5 w-5 text-purple-400" />
                                </div>
                                <span className="text-slate-300">{featureChannel.deadline}</span>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Tabs defaultValue="active-goals" className="space-y-6">
                    <TabsList className="bg-slate-900/30 backdrop-blur-sm border border-slate-800/50 p-1 h-12">
                        <TabsTrigger
                            value="active-goals"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-900/20 h-10"
                        >
                            Active Goals
                        </TabsTrigger>
                        <TabsTrigger
                            value="completed-goals"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-900/20 h-10"
                        >
                            Completed Goals
                        </TabsTrigger>
                        <TabsTrigger
                            value="my-commits"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-900/20 h-10"
                        >
                            My Commits
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="goals">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-white">Available Goals</h2>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {goals.map((goal) => (
                                    <Card
                                        key={goal.id}
                                        className="border-slate-800/30 bg-slate-900/30 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-slate-700/50 group"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-slate-900/0 to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        <CardHeader>
                                            <div className="flex justify-between items-center">
                                                <CardTitle className="text-lg text-white">{goal.name}</CardTitle>
                                                <Badge
                                                    variant={goal.status === "completed" ? "default" : "outline"}
                                                    className={
                                                        goal.status === "completed"
                                                            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-sm shadow-green-900/20"
                                                            : "border-slate-700 text-slate-300"
                                                    }
                                                >
                                                    {goal.status === "completed"
                                                        ? "Completed"
                                                        : goal.status === "in-progress"
                                                            ? "In Progress"
                                                            : "Not Started"}
                                                </Badge>
                                            </div>
                                            <CardDescription className="text-slate-400">{goal.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="text-slate-400">Deadline: {goal.deadline}</div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-slate-400">Progress</span>
                                                    <span className="text-white">{goal.progress}%</span>
                                                </div>
                                                <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-800/80 p-0.5">
                                                    <div
                                                        className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_5px_rgba(0,255,255,0.5)]"
                                                        style={{ width: `${goal.progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                            {goal.status !== "completed" && unsubmittedCommits.length > 0 && (
                                                <Button
                                                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 shadow-lg shadow-blue-900/20"
                                                    onClick={() => {
                                                        setSelectedGoal(goal)
                                                        setIsSubmitCommitDialogOpen(true)
                                                    }}
                                                >
                                                    <GitCommit className="mr-2 h-4 w-4" />
                                                    Submit Work for This Goal
                                                </Button>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                                {goals.length === 0 && (
                                    <div className="col-span-full flex h-40 items-center justify-center rounded-lg border border-dashed border-slate-800/50 bg-slate-900/20 backdrop-blur-sm">
                                        <p className="text-sm text-slate-400">No goals available in this feature channel</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="my-commits">
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-white">My Commits</h2>

                            <div className="space-y-6">
                                <h3 className="text-lg font-medium text-white">Unsubmitted Commits</h3>
                                {unsubmittedCommits.length === 0 ? (
                                    <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-slate-800/50 bg-slate-900/20 backdrop-blur-sm">
                                        <p className="text-sm text-slate-400">No unsubmitted commits</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {unsubmittedCommits.map((commit) => (
                                            <Card key={commit.id} className="border-slate-800/30 bg-slate-900/30 backdrop-blur-md shadow-xl">
                                                <CardHeader className="pb-2">
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <CardTitle className="text-white flex items-center gap-2">
                                                                <div className="bg-slate-800/80 p-1.5 rounded-md">
                                                                    <GitBranch className="h-4 w-4 text-cyan-400" />
                                                                </div>
                                                                <span>{commit.hash.substring(0, 7)}</span>
                                                            </CardTitle>
                                                            <CardDescription className="text-slate-400 mt-1">
                                                                {new Date(commit.timestamp).toLocaleString()}
                                                            </CardDescription>
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-3">
                                                        <div className="bg-slate-900/50 p-3 rounded-md border border-slate-800/50">
                                                            <p className="text-white">{commit.message}</p>
                                                        </div>
                                                        <Button
                                                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 shadow-lg shadow-blue-900/20"
                                                            onClick={() => {
                                                                setSelectedCommit(commit.id)
                                                                setIsSubmitCommitDialogOpen(true)
                                                            }}
                                                        >
                                                            <GitCommit className="mr-2 h-4 w-4" />
                                                            Submit for Goal
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}

                                <h3 className="text-lg font-medium text-white mt-8">Submitted Commits</h3>
                                {commits.filter((c) => c.submitted).length === 0 ? (
                                    <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-slate-800/50 bg-slate-900/20 backdrop-blur-sm">
                                        <p className="text-sm text-slate-400">No submitted commits</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {commits
                                            .filter((c) => c.submitted)
                                            .map((commit) => {
                                                const relatedGoal = goals.find((g) => g.id === commit.goalId)
                                                return (
                                                    <Card
                                                        key={commit.id}
                                                        className="border-slate-800/30 bg-slate-900/30 backdrop-blur-md shadow-xl"
                                                    >
                                                        <CardHeader className="pb-2">
                                                            <div className="flex justify-between items-center">
                                                                <div>
                                                                    <CardTitle className="text-white flex items-center gap-2">
                                                                        <div className="bg-slate-800/80 p-1.5 rounded-md">
                                                                            <GitBranch className="h-4 w-4 text-cyan-400" />
                                                                        </div>
                                                                        <span>{commit.hash.substring(0, 7)}</span>
                                                                    </CardTitle>
                                                                    <CardDescription className="text-slate-400 mt-1">
                                                                        {new Date(commit.timestamp).toLocaleString()}
                                                                    </CardDescription>
                                                                </div>
                                                                {commit.status && (
                                                                    <Badge
                                                                        className={
                                                                            commit.status === "approved"
                                                                                ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0"
                                                                                : commit.status === "rejected"
                                                                                    ? "bg-gradient-to-r from-red-500 to-rose-600 text-white border-0"
                                                                                    : "bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0"
                                                                        }
                                                                    >
                                                                        {commit.status === "approved"
                                                                            ? "Approved"
                                                                            : commit.status === "rejected"
                                                                                ? "Rejected"
                                                                                : "Pending"}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </CardHeader>
                                                        <CardContent>
                                                            <div className="space-y-3">
                                                                <div className="bg-slate-900/50 p-3 rounded-md border border-slate-800/50">
                                                                    <p className="text-white">{commit.message}</p>
                                                                </div>
                                                                {relatedGoal && (
                                                                    <div className="flex items-center gap-2 mt-2">
                                                                        <span className="text-sm text-slate-400">Goal:</span>
                                                                        <Badge variant="outline" className="border-slate-700 text-slate-300">
                                                                            {relatedGoal.name}
                                                                        </Badge>
                                                                    </div>
                                                                )}
                                                                {commit.comment && (
                                                                    <div className="mt-3 bg-slate-800/50 p-3 rounded-md border border-slate-700/50">
                                                                        <p className="text-sm text-slate-300 mb-1">Comment from TL:</p>
                                                                        <p className="text-white">{commit.comment}</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                )
                                            })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Submit Commit Dialog */}
                <Dialog open={isSubmitCommitDialogOpen} onOpenChange={setIsSubmitCommitDialogOpen}>
                    <DialogContent className="border-slate-800/50 bg-black/90 backdrop-blur-xl text-white shadow-xl shadow-purple-900/10">
                        <DialogHeader>
                            <DialogTitle className="text-xl text-white">Submit Commit for Goal</DialogTitle>
                            <DialogDescription className="text-slate-400">
                                {selectedGoal
                                    ? `Submit a commit for the goal: ${selectedGoal.name}`
                                    : "Select a goal to submit this commit for review."}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            {selectedCommit ? (
                                <div className="bg-slate-900/50 p-3 rounded-md border border-slate-800/50 mb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="bg-slate-800/80 p-1.5 rounded-md">
                                            <GitBranch className="h-4 w-4 text-cyan-400" />
                                        </div>
                                        <span className="text-white font-medium">
                                            {commits.find((c) => c.id === selectedCommit)?.hash.substring(0, 7)}
                                        </span>
                                    </div>
                                    <p className="text-white">{commits.find((c) => c.id === selectedCommit)?.message}</p>
                                </div>
                            ) : null}

                            {!selectedGoal && (
                                <div className="grid gap-2">
                                    <Label htmlFor="goal" className="text-slate-300">
                                        Select Goal
                                    </Label>
                                    <Select onValueChange={(value) => setSelectedGoal(goals.find((g) => g.id === value) || null)}>
                                        <SelectTrigger className="border-slate-800/50 bg-slate-900/50 text-white focus:border-cyan-500 focus:ring-cyan-500">
                                            <SelectValue placeholder="Select a goal" />
                                        </SelectTrigger>
                                        <SelectContent className="border-slate-800 bg-black/90 backdrop-blur-xl text-white">
                                            {goals
                                                .filter((g) => g.status !== "completed")
                                                .map((goal) => (
                                                    <SelectItem key={goal.id} value={goal.id} className="focus:bg-slate-800 focus:text-cyan-400">
                                                        {goal.name}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {!selectedCommit && selectedGoal && (
                                <div className="grid gap-2">
                                    <Label htmlFor="commit" className="text-slate-300">
                                        Select Commit
                                    </Label>
                                    <Select onValueChange={(value) => setSelectedCommit(value)}>
                                        <SelectTrigger className="border-slate-800/50 bg-slate-900/50 text-white focus:border-cyan-500 focus:ring-cyan-500">
                                            <SelectValue placeholder="Select a commit" />
                                        </SelectTrigger>
                                        <SelectContent className="border-slate-800 bg-black/90 backdrop-blur-xl text-white">
                                            {unsubmittedCommits.map((commit) => (
                                                <SelectItem
                                                    key={commit.id}
                                                    value={commit.id}
                                                    className="focus:bg-slate-800 focus:text-cyan-400"
                                                >
                                                    {commit.hash.substring(0, 7)} - {commit.message.substring(0, 30)}...
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsSubmitCommitDialogOpen(false)
                                    setSelectedCommit(null)
                                    setSelectedGoal(null)
                                }}
                                className="border-slate-800 bg-transparent text-white hover:text-cyan-400 hover:border-cyan-400"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmitCommit}
                                disabled={!selectedGoal || !selectedCommit}
                                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 gap-2"
                            >
                                <GitCommit className="h-4 w-4" />
                                Submit for Review
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    )
}
