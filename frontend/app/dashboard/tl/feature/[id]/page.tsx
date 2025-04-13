"use client"

import { useState } from "react"
import { GitBranch, Plus, Users, Check, X, Github } from "lucide-react"
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
    assignee: "Alex Johnson",
  },
  {
    id: "goal-2",
    name: "Set up authentication API",
    description: "Implement backend API endpoints for authentication",
    progress: 75,
    status: "in-progress" as const,
    assignee: "Jamie Smith",
  },
  {
    id: "goal-3",
    name: "Add password reset functionality",
    description: "Create password reset flow with email verification",
    progress: 30,
    status: "in-progress" as const,
    assignee: "Taylor Wilson",
  },
]

// Sample developers for assignment
const developers = [
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
    status: "pending" as const,
  },
  {
    id: "commit-2",
    goalId: "goal-3",
    developer: "Taylor Wilson",
    message: "Added password reset email template",
    hash: "e4f5g6h",
    timestamp: "2023-11-09T16:45:00Z",
    status: "pending" as const,
  },
]

export default function FeatureChannelPage({ params }: { params: { id: string } }) {
  const [featureChannel, setFeatureChannel] = useState(initialFeatureChannel)
  const [goals, setGoals] = useState(initialGoals)
  const [commits, setCommits] = useState(initialCommits)
  const [newGoalName, setNewGoalName] = useState("")
  const [newGoalDescription, setNewGoalDescription] = useState("")
  const [selectedDeveloper, setSelectedDeveloper] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false)
  const [newMemberEmail, setNewMemberEmail] = useState("")

  const handleCreateGoal = () => {
    const selectedDev = developers.find((dev) => dev.id === selectedDeveloper)

    const newGoal = {
      id: `goal-${goals.length + 1}`,
      name: newGoalName,
      description: newGoalDescription,
      progress: 0,
      status: "not-started" as const,
      assignee: selectedDev ? selectedDev.name : "Unassigned",
    }

    setGoals([...goals, newGoal])
    setNewGoalName("")
    setNewGoalDescription("")
    setSelectedDeveloper("")
    setIsDialogOpen(false)
  }

  const handleAddMember = () => {
    // In a real app, this would send an invitation to the email
    setNewMemberEmail("")
    setIsAddMemberDialogOpen(false)
  }

  const handleApproveCommit = (commitId: string) => {
    const updatedCommits = commits.map((commit) => {
      if (commit.id === commitId) {
        return { ...commit, status: "approved" as const }
      }
      return commit
    })

    // Update the related goal progress
    const commit = commits.find((c) => c.id === commitId)
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
  }

  const handleRejectCommit = (commitId: string) => {
    const updatedCommits = commits.map((commit) => {
      if (commit.id === commitId) {
        return { ...commit, status: "rejected" as const }
      }
      return commit
    })
    setCommits(updatedCommits)
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
                Add Member
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
                      <DialogDescription className="text-slate-400">
                        Add a new goal and assign a developer.
                      </DialogDescription>
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
                        <Label htmlFor="developer" className="text-slate-300">
                          Assign Developer
                        </Label>
                        <select
                          id="developer"
                          value={selectedDeveloper}
                          onChange={(e) => setSelectedDeveloper(e.target.value)}
                          className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">Select a developer</option>
                          {developers.map((dev) => (
                            <option key={dev.id} value={dev.id}>
                              {dev.name}
                            </option>
                          ))}
                        </select>
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
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 p-0.5">
                          <Avatar className="h-6 w-6 border border-black">
                            <AvatarImage src="/placeholder.svg" alt={goal.assignee} />
                            <AvatarFallback className="bg-slate-800 text-white text-xs">
                              {goal.assignee.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <span className="text-sm text-slate-300">{goal.assignee}</span>
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
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1 border-slate-800 bg-slate-900/30 text-white hover:text-cyan-400 hover:border-cyan-500/50 backdrop-blur-sm"
                          size="sm"
                        >
                          Edit
                        </Button>
                        {goal.status !== "completed" && (
                          <Button
                            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 shadow-lg shadow-blue-900/20"
                            size="sm"
                          >
                            {goal.progress === 100 ? "Complete" : "Update"}
                          </Button>
                        )}
                      </div>
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
                                </CardTitle>
                                <CardDescription className="text-slate-400 mt-1">
                                  {new Date(commit.timestamp).toLocaleString()}
                                </CardDescription>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white border-0 shadow-sm shadow-green-900/20"
                                  onClick={() => handleApproveCommit(commit.id)}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-red-800/50 text-red-400 hover:text-red-300 hover:border-red-700"
                                  onClick={() => handleRejectCommit(commit.id)}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Reject
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
              <DialogTitle className="text-xl text-white">Add Team Member</DialogTitle>
              <DialogDescription className="text-slate-400">
                Invite a developer to join this feature channel.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="member-email" className="text-slate-300">
                  Developer Email
                </Label>
                <Input
                  id="member-email"
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="developer@example.com"
                  className="border-slate-800/50 bg-slate-900/50 text-white focus:border-cyan-500 focus:ring-cyan-500"
                />
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
                onClick={handleAddMember}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0"
              >
                Send Invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
