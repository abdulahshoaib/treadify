"use client"

import { useState } from "react"
import { GitBranch, Plus, Users, Check, X, Github, ExternalLink } from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"

// Sample data for demonstration
const initialFeatureChannel = {
  id: "feat-1",
  name: "User Authentication",
  description: "Implement secure login and registration system",
  deadline: "Nov 20, 2023",
  progress: 68,
  repo: "treadify/mobile-app",
  members: 3,
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

// Sample developers in the product channel
const productChannelMembers = [
  { id: "dev-1", name: "Alex Johnson" },
  { id: "dev-2", name: "Jamie Smith" },
  { id: "dev-3", name: "Taylor Wilson" },
  { id: "dev-4", name: "Jordan Lee" },
]

// Sample commits for review
const initialCommits = [
  {
    id: "commit-1",
    goalId: "goal-2",
    developer: "Jamie Smith",
    message: "Implemented user authentication API endpoints",
    hash: "a1b2c3d",
    timestamp: "2023-11-10T14:30:00Z",
    status: "pending" as "pending" | "approved" | "rejected",
    gitBlameUrl: "https://github.com/treadify/mobile-app/blame/a1b2c3d",
    comment: "",
  },
  {
    id: "commit-2",
    goalId: "goal-3",
    developer: "Taylor Wilson",
    message: "Added password reset email template",
    hash: "e4f5g6h",
    timestamp: "2023-11-09T16:45:00Z",
    status: "pending" as "pending" | "approved" | "rejected",
    gitBlameUrl: "https://github.com/treadify/mobile-app/blame/e4f5g6h",
    comment: "",
  },
]

type GoalStatus = "not-started" | "in-progress" | "completed"

type Goal = {
  id: string
  name: string
  description: string
  progress: number
  status: GoalStatus
  deadline: string
}

export default function FeatureChannelPage() {
  const [featureChannel] = useState(initialFeatureChannel)
  const [goals, setGoals] = useState<Goal[]>(initialGoals)
  const [editingGoal, setEditingGoal] = useState<(Goal | null)>(null)
  const [commits, setCommits] = useState(initialCommits)
  const [newGoalName, setNewGoalName] = useState("")
  const [newGoalDescription, setNewGoalDescription] = useState("")
  const [newGoalDeadline, setNewGoalDeadline] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false)
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [selectedCommit, setSelectedCommit] = useState<string | null>(null)
  const [commitComment, setCommitComment] = useState("")
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [isEditGoalDialogOpen, setIsEditGoalDialogOpen] = useState(false)

  const handleCreateGoal = () => {
    const newGoal = {
      id: `goal-${goals.length + 1}`,
      name: newGoalName,
      description: newGoalDescription,
      progress: 0,
      status: "not-started" as const,
      deadline: newGoalDeadline,
    }

    setGoals([...goals, newGoal])
    setNewGoalName("")
    setNewGoalDescription("")
    setNewGoalDeadline("")
    setIsDialogOpen(false)
  }

  const handleEditGoal = () => {
    if (!editingGoal) return

    const updatedGoals = goals.map((goal) => {
      if (goal.id === editingGoal.id) {
        return {
          ...editingGoal,
        }
      }
      return goal
    })

    setGoals(updatedGoals)
    setEditingGoal(null)
    setIsEditGoalDialogOpen(false)
  }

  const handleAddMembers = () => {
    // In a real app, this would add the selected members to the feature channel
    setSelectedMembers([])
    setIsAddMemberDialogOpen(false)
  }

  const handleApproveCommit = () => {
    if (!selectedCommit) return

    const updatedCommits = commits.map((commit) => {
      if (commit.id === selectedCommit) {
        return {
          ...commit,
          status: "approved" as const,
          comment: commitComment,
        }
      }
      return commit
    })

    // Update the related goal progress
    const commit = commits.find((c) => c.id === selectedCommit)
    if (commit) {
      const updatedGoals = goals.map((goal) => {
        if (goal.id === commit.goalId) {
          return { ...goal, progress: 100, status: "completed" as const }
        }
        return goal
      })
      setGoals(updatedGoals)
    }

    setCommits(updatedCommits)
    setSelectedCommit(null)
    setCommitComment("")
    setIsReviewDialogOpen(false)
  }

  const handleRejectCommit = () => {
    if (!selectedCommit) return

    const updatedCommits = commits.map((commit) => {
      if (commit.id === selectedCommit) {
        return {
          ...commit,
          status: "rejected" as const,
          comment: commitComment,
        }
      }
      return commit
    })

    setCommits(updatedCommits)
    setSelectedCommit(null)
    setCommitComment("")
    setIsReviewDialogOpen(false)
  }

  // Calculate overall progress
  const overallProgress =
    goals.length > 0 ? Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length) : 0

  // Count completed goals
  const completedGoals = goals.filter((goal) => goal.status === "completed").length
  const totalGoals = goals.length

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* Background gradient effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[15%] w-[40rem] h-[40rem] rounded-full bg-purple-600/30 blur-3xl opacity-20"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[35rem] h-[35rem] rounded-full bg-blue-600/30 blur-3xl opacity-20"></div>
        <div className="absolute top-[60%] left-[40%] w-[30rem] h-[30rem] rounded-full bg-cyan-600/30 blur-3xl opacity-20"></div>
        <div className="absolute top-[30%] right-[25%] w-[25rem] h-[25rem] rounded-full bg-green-600/30 blur-3xl opacity-20"></div>
      </div>

      <DashboardHeader userName="Michael Chen" userRole="Technical Lead" />
      <main className="relative z-10 flex-1 p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
              {featureChannel.name}
            </h1>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-slate-800 bg-slate-900/30 text-white hover:text-cyan-400 hover:border-cyan-500/50 backdrop-blur-sm"
                onClick={() => setIsAddMemberDialogOpen(true)}
              >
                <Users className="mr-2 h-4 w-4" />
                Add Members
              </Button>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <Card className="border-slate-800/30 bg-slate-900/30 backdrop-blur-md shadow-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white">Overall Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Progress</span>
                    <span className="font-medium text-white">{overallProgress}%</span>
                  </div>
                  <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-800/80 p-0.5">
                    <div
                      className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_5px_rgba(0,255,255,0.5)]"
                      style={{ width: `${overallProgress}%` }}
                    />
                  </div>
                </div>
                <div className="mt-2 text-sm text-slate-400">
                  Goals: {completedGoals}/{totalGoals} completed
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
                <CardTitle className="text-sm font-medium text-white">Team Members</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center space-x-3">
                <div className="bg-slate-800/80 p-2.5 rounded-md">
                  <Users className="h-5 w-5 text-purple-400" />
                </div>
                <span className="text-slate-300">{featureChannel.members} developers</span>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="goals" className="space-y-6">
          <TabsList className="bg-slate-900/30 backdrop-blur-sm border border-slate-800/50 p-1 h-12">
            <TabsTrigger
              value="goals"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-900/20 h-10"
            >
              Goals
            </TabsTrigger>
            <TabsTrigger
              value="commits"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-900/20 h-10"
            >
              Commits
            </TabsTrigger>
          </TabsList>

          <TabsContent value="goals">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Goals</h2>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 shadow-lg shadow-blue-900/20">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Goal
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="border-slate-800/50 bg-black/90 backdrop-blur-xl text-white shadow-xl shadow-purple-900/10">
                    <DialogHeader>
                      <DialogTitle className="text-xl text-white">Create New Goal</DialogTitle>
                      <DialogDescription className="text-slate-400">Add a new goal for this feature.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="goal-name" className="text-slate-300">
                          Goal Name
                        </Label>
                        <Input
                          id="goal-name"
                          value={newGoalName}
                          onChange={(e) => setNewGoalName(e.target.value)}
                          placeholder="Enter goal name"
                          className="border-slate-800/50 bg-slate-900/50 text-white focus:border-cyan-500 focus:ring-cyan-500"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="goal-description" className="text-slate-300">
                          Description
                        </Label>
                        <Textarea
                          id="goal-description"
                          value={newGoalDescription}
                          onChange={(e) => setNewGoalDescription(e.target.value)}
                          placeholder="Describe the goal"
                          className="border-slate-800/50 bg-slate-900/50 text-white focus:border-cyan-500 focus:ring-cyan-500"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="goal-deadline" className="text-slate-300">
                          Deadline
                        </Label>
                        <Input
                          id="goal-deadline"
                          type="date"
                          value={newGoalDeadline}
                          onChange={(e) => setNewGoalDeadline(e.target.value)}
                          className="border-slate-800/50 bg-slate-900/50 text-white focus:border-cyan-500 focus:ring-cyan-500"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                        className="border-slate-800 bg-transparent text-white hover:text-cyan-400 hover:border-cyan-400"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCreateGoal}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0"
                      >
                        Create
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
                      <Button
                        variant="outline"
                        className="w-full border-slate-800 bg-slate-900/30 text-white hover:text-cyan-400 hover:border-cyan-500/50 backdrop-blur-sm"
                        size="sm"
                        onClick={() => {
                          setEditingGoal(goal)
                          setIsEditGoalDialogOpen(true)
                        }}
                      >
                        Edit Goal
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="commits">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">Pending Commits</h2>

              {commits.filter((c) => c.status === "pending").length === 0 ? (
                <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-slate-800/50 bg-slate-900/20 backdrop-blur-sm">
                  <p className="text-sm text-slate-400">No pending commits to review</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {commits
                    .filter((c) => c.status === "pending")
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
                                  <a
                                    href={commit.gitBlameUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-sm font-normal"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                    View on GitHub
                                  </a>
                                </CardTitle>
                                <CardDescription className="text-slate-400 mt-1">
                                  {new Date(commit.timestamp).toLocaleString()}
                                </CardDescription>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white border-0 shadow-sm shadow-green-900/20"
                                  onClick={() => {
                                    setSelectedCommit(commit.id)
                                    setIsReviewDialogOpen(true)
                                  }}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Review
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <div className="rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 p-0.5">
                                  <Avatar className="h-6 w-6 border border-black">
                                    <AvatarImage src="/placeholder.svg" alt={commit.developer} />
                                    <AvatarFallback className="bg-slate-800 text-white text-xs">
                                      {commit.developer.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                </div>
                                <span className="text-sm text-slate-300">{commit.developer}</span>
                              </div>
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
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                </div>
              )}

              <h2 className="text-xl font-semibold text-white mt-8">Reviewed Commits</h2>

              {commits.filter((c) => c.status !== "pending").length === 0 ? (
                <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-slate-800/50 bg-slate-900/20 backdrop-blur-sm">
                  <p className="text-sm text-slate-400">No reviewed commits yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {commits
                    .filter((c) => c.status !== "pending")
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
                                  <a
                                    href={commit.gitBlameUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-sm font-normal"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                    View on GitHub
                                  </a>
                                </CardTitle>
                                <CardDescription className="text-slate-400 mt-1">
                                  {new Date(commit.timestamp).toLocaleString()}
                                </CardDescription>
                              </div>
                              <Badge
                                className={
                                  commit.status === "approved"
                                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0"
                                    : "bg-gradient-to-r from-red-500 to-rose-600 text-white border-0"
                                }
                              >
                                {commit.status === "approved" ? "Approved" : "Rejected"}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <div className="rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 p-0.5">
                                  <Avatar className="h-6 w-6 border border-black">
                                    <AvatarImage src="/placeholder.svg" alt={commit.developer} />
                                    <AvatarFallback className="bg-slate-800 text-white text-xs">
                                      {commit.developer.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                </div>
                                <span className="text-sm text-slate-300">{commit.developer}</span>
                              </div>
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
          </TabsContent>
        </Tabs>

        {/* Add Member Dialog */}
        <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
          <DialogContent className="border-slate-800/50 bg-black/90 backdrop-blur-xl text-white shadow-xl shadow-purple-900/10">
            <DialogHeader>
              <DialogTitle className="text-xl text-white">Add Team Members</DialogTitle>
              <DialogDescription className="text-slate-400">
                Select developers from the product channel to add to this feature.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="space-y-4">
                {productChannelMembers.map((member) => (
                  <div key={member.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={member.id}
                      checked={selectedMembers.includes(member.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedMembers([...selectedMembers, member.id])
                        } else {
                          setSelectedMembers(selectedMembers.filter((id) => id !== member.id))
                        }
                      }}
                      className="border-slate-700 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                    />
                    <label
                      htmlFor={member.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                    >
                      <div className="rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 p-0.5">
                        <Avatar className="h-6 w-6 border border-black">
                          <AvatarImage src="/placeholder.svg" alt={member.name} />
                          <AvatarFallback className="bg-slate-800 text-white text-xs">
                            {member.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      {member.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddMemberDialogOpen(false)}
                className="border-slate-800 bg-transparent text-white hover:text-cyan-400 hover:border-cyan-400"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddMembers}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0"
              >
                Add Selected Members
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Goal Dialog */}
        <Dialog open={isEditGoalDialogOpen} onOpenChange={setIsEditGoalDialogOpen}>
          <DialogContent className="border-slate-800/50 bg-black/90 backdrop-blur-xl text-white shadow-xl shadow-purple-900/10">
            <DialogHeader>
              <DialogTitle className="text-xl text-white">Edit Goal</DialogTitle>
              <DialogDescription className="text-slate-400">Update the goal details.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-goal-name" className="text-slate-300">
                  Goal Name
                </Label>
                <Input
                  id="edit-goal-name"
                  value={editingGoal?.name || ""}
                  onChange={(e) => setEditingGoal(editingGoal ? { ...editingGoal, name: e.target.value } : null)}
                  placeholder="Enter goal name"
                  className="border-slate-800/50 bg-slate-900/50 text-white focus:border-cyan-500 focus:ring-cyan-500"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-goal-description" className="text-slate-300">
                  Description
                </Label>
                <Textarea
                  id="edit-goal-description"
                  value={editingGoal?.description || ""}
                  onChange={(e) => setEditingGoal(editingGoal ? { ...editingGoal, description: e.target.value } : null)}
                  placeholder="Describe the goal"
                  className="border-slate-800/50 bg-slate-900/50 text-white focus:border-cyan-500 focus:ring-cyan-500"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-goal-deadline" className="text-slate-300">
                  Deadline
                </Label>
                <Input
                  id="edit-goal-deadline"
                  type="date"
                  value={editingGoal?.deadline || ""}
                  onChange={(e) => setEditingGoal(editingGoal ? { ...editingGoal, deadline: e.target.value } : null)}
                  className="border-slate-800/50 bg-slate-900/50 text-white focus:border-cyan-500 focus:ring-cyan-500"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditGoalDialogOpen(false)}
                className="border-slate-800 bg-transparent text-white hover:text-cyan-400 hover:border-cyan-400"
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditGoal}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Review Commit Dialog */}
        <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
          <DialogContent className="border-slate-800/50 bg-black/90 backdrop-blur-xl text-white shadow-xl shadow-purple-900/10">
            <DialogHeader>
              <DialogTitle className="text-xl text-white">Review Commit</DialogTitle>
              <DialogDescription className="text-slate-400">
                Review and approve or reject this commit.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {selectedCommit && (
                <>
                  <div className="bg-slate-900/50 p-3 rounded-md border border-slate-800/50 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-slate-800/80 p-1.5 rounded-md">
                        <GitBranch className="h-4 w-4 text-cyan-400" />
                      </div>
                      <span className="text-white font-medium">
                        {commits.find((c) => c.id === selectedCommit)?.hash.substring(0, 7)}
                      </span>
                      <a
                        href={commits.find((c) => c.id === selectedCommit)?.gitBlameUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-sm"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View on GitHub
                      </a>
                    </div>
                    <p className="text-white">{commits.find((c) => c.id === selectedCommit)?.message}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 p-0.5">
                        <Avatar className="h-6 w-6 border border-black">
                          <AvatarImage
                            src="/placeholder.svg"
                            alt={commits.find((c) => c.id === selectedCommit)?.developer}
                          />
                          <AvatarFallback className="bg-slate-800 text-white text-xs">
                            {commits.find((c) => c.id === selectedCommit)?.developer.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <span className="text-sm text-slate-300">
                        {commits.find((c) => c.id === selectedCommit)?.developer}
                      </span>
                    </div>
                  </div>
                  <div className="grid gap-2 mb-4">
                    <Label htmlFor="commit-comment" className="text-slate-300">
                      Comment (optional)
                    </Label>
                    <Textarea
                      id="commit-comment"
                      value={commitComment}
                      onChange={(e) => setCommitComment(e.target.value)}
                      placeholder="Add a comment about this commit"
                      className="border-slate-800/50 bg-slate-900/50 text-white focus:border-cyan-500 focus:ring-cyan-500"
                    />
                  </div>
                </>
              )}
            </div>
            <DialogFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={handleRejectCommit}
                className="border-red-800/50 bg-transparent text-red-400 hover:text-red-300 hover:border-red-700"
              >
                <X className="h-4 w-4 mr-1" />
                Reject
              </Button>
              <Button
                onClick={handleApproveCommit}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white border-0"
              >
                <Check className="h-4 w-4 mr-1" />
                Approve
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
