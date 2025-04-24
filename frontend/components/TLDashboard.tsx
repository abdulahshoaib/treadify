"use client"

import { useState, useEffect } from "react"
import { Copy, Github, ArrowUpRight, Star, GitFork, Eye, BarChart3, Code, Target } from "lucide-react"
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
import { toast } from "sonner"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface Activity {
  id: string
  type?: string
  timestamp: string
  message?: string
  author?: string
}

interface Goal {
  id: string | number
  name?: string
  status: string
  description?: string
  assignedTo?: string
  deadline: string
  completedTasks?: number
  totalTasks?: number
  progress?: number
}

function formatDate(isoDate: string): string {
  if (!isoDate) return "N/A"

  try {
    const date = new Date(isoDate)
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  } catch (error) {
    return "Invalid date"
  }
}

export default function TLDashboard({ data: initialData }: any) {
  const [joinCode, setJoinCode] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [data, setData] = useState<any>(initialData)

  useEffect(() => {
    if (data && data !== initialData) {
      console.log("Data updated - refreshing view")
    }
  }, [data, initialData])

  const product = data?.data?.product || null
  const goals = data?.data?.goals || []

  async function handleJoinChannel() {
    try {
      const response = await fetch("/api/validate-channel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: joinCode }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || "Failed to join channel")
      }
      setData(data)
      toast.success("Successfully joined channel!")
      setIsDialogOpen(false)
    } catch (err: any) {
      toast.error(err.message || "Failed to join channel")
    }
  }

  const calculateOverallCompletion = () => {
    if (!goals?.length) return 0
    const total = goals.reduce((acc: number, g: { progress?: number }) => acc + (g?.progress || 0), 0)
    return Math.round(total / goals.length)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-progress":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  return (
    <main className="relative z-10 flex-1 p-6 select-none">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
          Dashboard
        </h1>
      </div>

      {!product ? (
        <div className="mt-16 flex flex-col items-center justify-center">
          <div className="max-w-md text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Not Assigned to a Channel</h2>
            <p className="text-slate-400 mb-6">
              You haven't been assigned to any product channel yet. Join a channel using a join code from your Product
              Manager.
            </p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 shadow-lg shadow-blue-900/20 px-8 py-6 text-lg tracking-tighter">
                  <Code className="mr-2 h-5 w-5" />
                  Join Channel
                </Button>
              </DialogTrigger>
              <DialogContent
                onEscapeKeyDown={(e) => {
                  e.preventDefault()
                }}
                className="border-none bg-slate-950/50 backdrop-blur-xl text-white shadow-xl shadow-purple-900/10 pointer-events-auto"
              >
                <DialogHeader>
                  <DialogTitle className="text-xl text-white tracking-tighter">Join Product Channel</DialogTitle>
                  <DialogDescription className="text-slate-400 tracking tight">
                    Enter the join code provided by your Product Manager
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-slate-300">
                    Join Code
                  </Label>
                  <Input
                    id="code"
                    placeholder="Join Code E.g (fdK12a9)"
                    onChange={(e) => setJoinCode(e.target.value)}
                    className="border-slate-800/50 bg-slate-900/50 text-white focus:border-cyan-500 focus:ring-cyan-500"
                  />
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
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 shadow-lg shadow-blue-900/20 tracking-tighter"
                    onClick={handleJoinChannel}
                    disabled={!joinCode}
                  >
                    Join
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-4 mt-14">
                <h1 className="text-4xl tracking-tight font-bold text-slate-300">{product.name}</h1>
                <Button
                  onClick={() => {
                    toast.info("Join Code Copied")
                    navigator.clipboard.writeText(product.inviteCode)
                  }}
                  className="text-sm text-blue-400 border border-blue-400 px-2 py-1 rounded hover:bg-blue-400 hover:text-white transition bg-slate-900"
                  title="Click to copy invite code"
                >
                  {product.inviteCode}
                  <Copy className="w-3 h-3 ml-1" />
                </Button>
              </div>
              <p className="text-slate-400 mt-1">{product.description || "No description provided"}</p>
              <p className="text-xs text-slate-500 mt-1">Deadline: {formatDate(product.deadline)}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="border-slate-800 bg-slate-900/50 text-white hover:bg-slate-800 hover:text-white"
                onClick={() => window.open(product.repository?.url, "_blank")}
              >
                <Github className="mr-2 h-4 w-4" />
                View Repository
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-slate-800/50 bg-slate-900/50 text-white col-span-full md:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Github className="mr-2 h-5 w-5" />
                  Repository
                </CardTitle>
                <CardDescription className="text-slate-400">GitHub repository details and stats</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Repository</span>
                  <a
                    href={product.repository?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline flex items-center"
                  >
                    {product.repository?.name}
                    <ArrowUpRight className="ml-1 h-3 w-3" />
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Last Updated</span>
                  <span>{formatDate(product.repository?.lastUpdated)}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <div className="flex flex-col items-center p-2 rounded-md bg-slate-800/50">
                    <Star className="h-4 w-4 text-amber-400 mb-1" />
                    <span className="text-lg font-semibold">{product.repository?.stars || 0}</span>
                    <span className="text-xs text-slate-400">Stars</span>
                  </div>
                  <div className="flex flex-col items-center p-2 rounded-md bg-slate-800/50">
                    <GitFork className="h-4 w-4 text-blue-400 mb-1" />
                    <span className="text-lg font-semibold">{product.repository?.forks || 0}</span>
                    <span className="text-xs text-slate-400">Forks</span>
                  </div>
                  <div className="flex flex-col items-center p-2 rounded-md bg-slate-800/50">
                    <Eye className="h-4 w-4 text-purple-400 mb-1" />
                    <span className="text-lg font-semibold">{product.repository?.watchers || 0}</span>
                    <span className="text-xs text-slate-400">Watchers</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-800/50 bg-slate-900/50 text-white col-span-full md:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-5 w-5" />
                  Goal Stats
                </CardTitle>
                <CardDescription className="text-slate-400">Overview of goal progress</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 mt-6">
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col items-center p-2 rounded-md bg-slate-800/50">
                    <span className="text-lg font-semibold">{goals.length}</span>
                    <span className="text-xs text-slate-400">Total</span>
                  </div>
                  <div className="flex flex-col items-center p-2 rounded-md bg-slate-800/50">
                    <span className="text-lg font-semibold">
                      {goals.filter((g: { status?: string }) => g?.status === "open").length}
                    </span>
                    <span className="text-xs text-slate-400">In Progress</span>
                  </div>
                  <div className="flex flex-col items-center p-2 rounded-md bg-slate-800/50">
                    <span className="text-lg font-semibold">
                      {goals.filter((g: { status?: string }) => g?.status === "completed").length}
                    </span>
                    <span className="text-xs text-slate-400">Completed</span>
                  </div>
                </div>

                <div className="w-full pt-2">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-slate-400">Overall Completion</span>
                    <span className="text-sm font-medium">{calculateOverallCompletion()}%</span>
                  </div>
                  <Progress value={calculateOverallCompletion()} className="h-2 bg-slate-800" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-800/50 bg-slate-900/50 text-white col-span-full md:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-slate-400">Latest updates and changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 relative">
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-800"></div>

                  {data?.activities?.length > 0 ? (
                    data.activities.map((activity: Activity) => (
                      <div key={activity?.id} className="flex gap-3 relative">
                        <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center z-10 mt-1">
                          <Github className="h-4 w-4 text-slate-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <p className="text-sm font-medium">
                              {activity?.type === "commit" ? "Commit" : activity?.type}
                            </p>
                            <span className="text-xs text-slate-400">{formatDate(activity?.timestamp)}</span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{activity?.message}</p>
                          <p className="text-xs text-slate-500 mt-1">by {activity?.author}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-4 text-center text-slate-400">No recent activity</div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t border-slate-800 px-6 py-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-slate-800 bg-slate-900/50 text-white hover:bg-slate-800 hover:text-white"
                  disabled={!data?.activities?.length}
                >
                  View All Activity
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold text-white mb-4">Goals</h2>
            {goals.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {goals.map((goal: Goal) => (
                  <Card key={goal?.id} className="border-slate-800/50 bg-slate-900/50 text-white">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{goal?.name}</CardTitle>
                        <Badge variant="outline" className={`ml-auto ${getStatusColor(goal?.status)}`}>
                          {goal?.status?.replace("-", " ")}
                        </Badge>
                      </div>
                      <CardDescription className="text-slate-400 mt-1">{goal?.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-400">Assigned to</span>
                          <span className="text-sm">{goal?.assignedTo}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-400">Deadline</span>
                          <span className="text-sm">{formatDate(goal?.deadline)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-400">Tasks</span>
                          <span className="text-sm">
                            {goal?.completedTasks || 0} / {goal?.totalTasks || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-400">Progress</span>
                          <span className="text-sm font-medium">{goal?.progress || 0}%</span>
                        </div>
                        <Progress value={goal?.progress || 0} className="h-2 bg-slate-800" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="p-8 bg-slate-900/50 rounded-lg text-center">
                <p className="text-slate-400">No goals added yet</p>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
