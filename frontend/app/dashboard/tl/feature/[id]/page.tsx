"use client"

import { useState } from "react"
import { CalendarClock, GitBranch, Plus, Users } from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
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

// Sample data for demonstration
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

export default function FeatureChannelPage({ params }: { params: { id: string } }) {
  const [goals, setGoals] = useState(initialGoals)
  const [newGoalName, setNewGoalName] = useState("")
  const [newGoalDescription, setNewGoalDescription] = useState("")
  const [selectedDeveloper, setSelectedDeveloper] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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

  // Calculate overall progress
  const overallProgress =
    goals.length > 0 ? Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length) : 0

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader userName="Michael Chen" userRole="Technical Lead" />
      <main className="flex-1 p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">User Authentication</h1>
            <div className="flex gap-2">
              <Button variant="outline">
                <GitBranch className="mr-2 h-4 w-4" />
                Connect GitHub
              </Button>
              <Button variant="outline">Manage Team</Button>
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">{overallProgress}%</span>
                  </div>
                  <Progress value={overallProgress} className="h-2" />
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
            <h2 className="text-xl font-semibold">Goals</h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Goal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Goal</DialogTitle>
                  <DialogDescription>Add a new goal and assign a developer.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="goal-name">Goal Name</Label>
                    <Input
                      id="goal-name"
                      value={newGoalName}
                      onChange={(e) => setNewGoalName(e.target.value)}
                      placeholder="Enter goal name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="goal-description">Description</Label>
                    <Textarea
                      id="goal-description"
                      value={newGoalDescription}
                      onChange={(e) => setNewGoalDescription(e.target.value)}
                      placeholder="Describe the goal"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="developer">Assign Developer</Label>
                    <select
                      id="developer"
                      value={selectedDeveloper}
                      onChange={(e) => setSelectedDeveloper(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateGoal}>Create</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {goals.map((goal) => (
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
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" size="sm">
                      Review
                    </Button>
                    {goal.status !== "completed" && (
                      <Button className="flex-1" size="sm">
                        {goal.progress === 100 ? "Complete" : "Update"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
