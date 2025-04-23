"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Plus, Tag, Clock, CheckCircle, ArrowLeft, Filter } from "lucide-react"
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
  FeatureId: string
  FeatureName: string
}

type Feature = {
  id: string
  name: string
}

function DateToString(date: Date | undefined): string {
  if (!date) return ""
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export default function GoalsClient() {
  const searchParams = useSearchParams()
  const featureId = searchParams.get("feature")

  const features: Feature[] = [
    { id: "feature-1", name: "User Authentication" },
    { id: "feature-2", name: "Dashboard UI" },
    { id: "feature-3", name: "API Integration" },
  ]

  const [selectedFeature, setSelectedFeature] = useState<string | null>(featureId)
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "goal-1",
      GoalName: "Implement login form",
      Description: "Create a login form with email and password fields",
      Deadline: "2025-05-10",
      CompletedAt: "2025-05-05",
      Status: "completed",
      CreatedBy: "John Doe",
      FeatureId: "feature-1",
      FeatureName: "User Authentication",
    },
    {
      id: "goal-2",
      GoalName: "Add password reset",
      Description: "Implement password reset functionality",
      Deadline: "2025-05-12",
      CompletedAt: null,
      Status: "open",
      CreatedBy: "Jane Smith",
      FeatureId: "feature-1",
      FeatureName: "User Authentication",
    },
    {
      id: "goal-3",
      GoalName: "Create dashboard layout",
      Description: "Design and implement the main dashboard layout",
      Deadline: "2025-05-20",
      CompletedAt: null,
      Status: "open",
      CreatedBy: "Alex Johnson",
      FeatureId: "feature-2",
      FeatureName: "Dashboard UI",
    },
    {
      id: "goal-4",
      GoalName: "Setup API client",
      Description: "Configure API client with authentication",
      Deadline: "2025-05-15",
      CompletedAt: null,
      Status: "open",
      CreatedBy: "Sarah Williams",
      FeatureId: "feature-3",
      FeatureName: "API Integration",
    },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newGoalName, setNewGoalName] = useState("")
  const [newGoalDescription, setNewGoalDescription] = useState("")
  const [newGoalFeature, setNewGoalFeature] = useState("")
  const [newGoalDeadline, setNewGoalDeadline] = useState<Date | undefined>(undefined)

  useEffect(() => {
    if (featureId) {
      setSelectedFeature(featureId)
    }
  }, [featureId])

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

  const handleCreateGoal = () => {
    if (!newGoalName || !newGoalFeature || !newGoalDeadline) {
      toast.error("Please fill in all required fields")
      return
    }

    const feature = features.find((f) => f.id === newGoalFeature)

    const newGoal: Goal = {
      id: `goal-${goals.length + 1}`,
      GoalName: newGoalName,
      Description: newGoalDescription,
      Deadline: DateToString(newGoalDeadline),
      CompletedAt: null,
      Status: "open",
      CreatedBy: "Current User", // In a real app, this would come from auth
      FeatureId: newGoalFeature,
      FeatureName: feature?.name || "",
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

  const markAsComplete = (goalId: string) => {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === goalId ? { ...goal, Status: "completed", CompletedAt: new Date().toISOString() } : goal,
      ),
    )
    toast.success(`Goal marked as completed!`)
  }

  const filteredGoals = goals.filter((goal) => {
    // Filter by feature if selected
    if (selectedFeature && goal.FeatureId !== selectedFeature) {
      return false
    }

    // Filter by status if not "all"
    if (filterStatus !== "all" && goal.Status !== filterStatus) {
      return false
    }

    return true
  })

  const getFeatureName = (featureId: string | null) => {
    if (!featureId) return "All Features"
    const feature = features.find((f) => f.id === featureId)
    return feature ? feature.name : "Unknown Feature"
  }

  return (
    <main className="relative z-10 flex-1 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white"
              onClick={() => (window.location.href = "/features")}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Features
            </Button>
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 mt-2">
            {selectedFeature ? `Goals: ${getFeatureName(selectedFeature)}` : "All Goals"}
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[140px] border-slate-800/50 bg-slate-900/50 text-white">
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
                    onChange={(e) => setNewGoalName(e.target.value)}
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
                    onChange={(e) => setNewGoalDescription(e.target.value)}
                    placeholder="Describe the goal"
                    className="border-slate-800/50 bg-slate-900/50 text-white focus:border-cyan-500 focus:ring-cyan-500"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="feature" className="text-slate-300">
                    Feature
                  </Label>
                  <Select value={newGoalFeature} onValueChange={setNewGoalFeature}>
                    <SelectTrigger className="border-slate-800/50 bg-slate-900/50 text-white">
                      <SelectValue placeholder="Select a feature" />
                    </SelectTrigger>
                    <SelectContent className="border-slate-800 bg-slate-900 text-white">
                      {features.map((feature) => (
                        <SelectItem key={feature.id} value={feature.id}>
                          {feature.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
        </div>
      </div>

      {filteredGoals.length === 0 ? (
        <div className="mt-16 flex flex-col items-center justify-center">
          <div className="max-w-md text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-4 tracking-tighter">No Goals Found</h2>
            <p className="text-slate-400 mb-6">
              {selectedFeature
                ? "This feature doesn't have any goals yet. Create one to start tracking progress."
                : "No goals match your current filters. Try changing your filter criteria or create a new goal."}
            </p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 shadow-lg shadow-blue-900/20 px-8 py-6 text-lg tracking-tighter"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Goal
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredGoals.map((goal) => (
            <Card key={goal.id} className="overflow-hidden border-slate-800/50 bg-slate-900/50 text-white">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center">
                      {goal.Status === "completed" && <CheckCircle className="mr-2 h-5 w-5 text-green-500" />}
                      {goal.GoalName}
                    </CardTitle>
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
                    <Badge
                      variant={getDaysRemaining(goal.Deadline) < 3 ? "destructive" : "secondary"}
                      className="ml-auto"
                    >
                      {getDaysRemaining(goal.Deadline)} days left
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="ml-auto border-green-800/50 text-green-400">
                      Completed
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
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
                {goal.Status === "open" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => markAsComplete(goal.id)}
                    className="border-slate-700 text-slate-300 hover:bg-green-900/30 hover:text-green-400 hover:border-green-700"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Complete
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}

