"use client"

import { useState } from "react"
import { CalendarClock, GitBranch, GitCommit, Users } from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Sample data for demonstration
const initialGoals = [
  {
    id: "goal-1",
    name: "Implement login form",
    description: "Create a responsive login form with validation",
    progress: 100,
    status: "completed" as const,
    assignee: "Jamie Smith",
    isAssignedToMe: true,
  },
  {
    id: "goal-2",
    name: "Set up authentication API",
    description: "Implement backend API endpoints for authentication",
    progress: 75,
    status: "in-progress" as const,
    assignee: "Jamie Smith",
    isAssignedToMe: true,
  },
  {
    id: "goal-3",
    name: "Add password reset functionality",
    description: "Create password reset flow with email verification",
    progress: 30,
    status: "in-progress" as const,
    assignee: "Taylor Wilson",
    isAssignedToMe: false,
  },
]

export default function DevFeatureChannelPage({ params }: { params: { id: string } }) {
  const [goals, setGoals] = useState(initialGoals)
  const [selectedGoal, setSelectedGoal] = useState<(typeof initialGoals)[0] | null>(null)
  const [updateProgress, setUpdateProgress] = useState<number>(0)
  const [commitMessage, setCommitMessage] = useState("")
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)

  const handleUpdateGoal = () => {
    if (!selectedGoal) return

    const updatedGoals = goals.map((goal) => {
      if (goal.id === selectedGoal.id) {
        return {
          ...goal,
          progress: updateProgress,
          status: updateProgress === 100 ? ("completed" as const) : ("in-progress" as const),
        }
      }
      return goal
    })

    setGoals(updatedGoals)
    setSelectedGoal(null)
    setUpdateProgress(0)
    setCommitMessage("")
    setIsUpdateDialogOpen(false)
  }

  const openUpdateDialog = (goal: (typeof initialGoals)[0]) => {
    setSelectedGoal(goal)
    setUpdateProgress(goal.progress)
    setIsUpdateDialogOpen(true)
  }

  // Filter goals assigned to the current user
  const myGoals = goals.filter((goal) => goal.isAssignedToMe)

  // Calculate my progress
  const myProgress =
    myGoals.length > 0 ? Math.round(myGoals.reduce((sum, goal) => sum + goal.progress, 0) / myGoals.length) : 0

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader userName="Jamie Smith" userRole="Developer" />
      <main className="flex-1 p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">User Authentication</h1>
            <Button variant="outline">
              <GitBranch className="mr-2 h-4 w-4" />
              Connect GitHub
            </Button>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">My Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">{myProgress}%</span>
                  </div>
                  <Progress value={myProgress} className="h-2" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Deadline</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center space-x-2">
                <CalendarClock className="h-5 w-5 text-muted-foreground" />
                <span>November 20, 2023</span>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span>3 developers</span>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">My Goals</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {myGoals.map((goal) => (
              <Card key={goal.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{goal.name}</CardTitle>
                    <Badge variant={goal.status === "completed" ? "default" : "outline"}>
                      {goal.status === "completed"
                        ? "Completed"
                        : goal.status === "in-progress"
                          ? "In Progress"
                          : "Not Started"}
                    </Badge>
                  </div>
                  <CardDescription>{goal.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="/placeholder.svg" alt={goal.assignee} />
                      <AvatarFallback>{goal.assignee.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{goal.assignee}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                  {goal.status !== "completed" && (
                    <Button className="w-full" onClick={() => openUpdateDialog(goal)}>
                      Update Progress
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
            {myGoals.length === 0 && (
              <div className="col-span-full flex h-40 items-center justify-center rounded-lg border border-dashed">
                <p className="text-sm text-muted-foreground">No goals assigned to you</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">All Goals</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {goals
              .filter((goal) => !goal.isAssignedToMe)
              .map((goal) => (
                <Card key={goal.id}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{goal.name}</CardTitle>
                      <Badge variant={goal.status === "completed" ? "default" : "outline"}>
                        {goal.status === "completed"
                          ? "Completed"
                          : goal.status === "in-progress"
                            ? "In Progress"
                            : "Not Started"}
                      </Badge>
                    </div>
                    <CardDescription>{goal.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/placeholder.svg" alt={goal.assignee} />
                        <AvatarFallback>{goal.assignee.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{goal.assignee}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Goal Progress</DialogTitle>
              <DialogDescription>Update your progress on this goal and add a commit message.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="goal-name">Goal</Label>
                <Input id="goal-name" value={selectedGoal?.name || ""} disabled />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="progress">Progress (%)</Label>
                <Input
                  id="progress"
                  type="number"
                  min="0"
                  max="100"
                  value={updateProgress}
                  onChange={(e) => setUpdateProgress(Number.parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="commit-message">Commit Message</Label>
                <Textarea
                  id="commit-message"
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  placeholder="Describe what you've accomplished"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateGoal} className="gap-2">
                <GitCommit className="h-4 w-4" />
                Submit Update
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
