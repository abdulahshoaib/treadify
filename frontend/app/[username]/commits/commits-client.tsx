"use client"

import { useState } from "react"
import { GitCommit, ExternalLink, Send, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Commit = {
  id: string
  hash: string
  message: string
  url: string
  date: string
  author: string
  submitted: boolean
  submissionStatus: "pending" | "accepted" | "rejected" | null
  feedback: string | null
}

type Goal = {
  id: string
  name: string
  featureId: string
  featureName: string
  status: "open" | "completed"
}

export default function CommitsClient() {
  const [commits, setCommits] = useState<Commit[]>([
    {
      id: "commit-1",
      hash: "a1b2c3d",
      message: "Implement login form with validation",
      url: "https://github.com/username/repo/commit/a1b2c3d",
      date: "2025-05-05T10:30:00Z",
      author: "John Doe",
      submitted: true,
      submissionStatus: "accepted",
      feedback: "Great work! Clean code and well-documented.",
    },
    {
      id: "commit-2",
      hash: "e4f5g6h",
      message: "Add password reset functionality",
      url: "https://github.com/username/repo/commit/e4f5g6h",
      date: "2025-05-06T14:20:00Z",
      author: "John Doe",
      submitted: true,
      submissionStatus: "rejected",
      feedback: "The implementation is not secure. Please fix the issues and resubmit.",
    },
    {
      id: "commit-3",
      hash: "i7j8k9l",
      message: "Create dashboard layout with responsive design",
      url: "https://github.com/username/repo/commit/i7j8k9l",
      date: "2025-05-07T09:15:00Z",
      author: "John Doe",
      submitted: true,
      submissionStatus: "pending",
      feedback: null,
    },
    {
      id: "commit-4",
      hash: "m1n2o3p",
      message: "Fix responsive issues on mobile devices",
      url: "https://github.com/username/repo/commit/m1n2o3p",
      date: "2025-05-08T11:45:00Z",
      author: "John Doe",
      submitted: false,
      submissionStatus: null,
      feedback: null,
    },
    {
      id: "commit-5",
      hash: "q4r5s6t",
      message: "Add API client configuration",
      url: "https://github.com/username/repo/commit/q4r5s6t",
      date: "2025-05-09T16:30:00Z",
      author: "John Doe",
      submitted: false,
      submissionStatus: null,
      feedback: null,
    },
  ])

  const goals: Goal[] = [
    {
      id: "goal-1",
      name: "Implement login form",
      featureId: "feature-1",
      featureName: "User Authentication",
      status: "completed",
    },
    {
      id: "goal-2",
      name: "Add password reset",
      featureId: "feature-1",
      featureName: "User Authentication",
      status: "open",
    },
    {
      id: "goal-3",
      name: "Create dashboard layout",
      featureId: "feature-2",
      featureName: "Dashboard UI",
      status: "open",
    },
    {
      id: "goal-4",
      name: "Setup API client",
      featureId: "feature-3",
      featureName: "API Integration",
      status: "open",
    },
  ]

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCommit, setSelectedCommit] = useState<Commit | null>(null)
  const [selectedGoal, setSelectedGoal] = useState<string>("")
  const [commitUrl, setCommitUrl] = useState<string>("")

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const handleSubmitCommit = (commit: Commit) => {
    setSelectedCommit(commit)
    setSelectedGoal("")
    setCommitUrl(commit.url)
    setIsDialogOpen(true)
  }

  const submitCommit = () => {
    if (!selectedCommit || !selectedGoal) {
      toast.error("Please select a goal for this commit")
      return
    }

    setCommits((prev) =>
      prev.map((commit) =>
        commit.id === selectedCommit.id ? { ...commit, submitted: true, submissionStatus: "pending" } : commit,
      ),
    )

    setIsDialogOpen(false)
    toast.success("Commit submitted for review successfully!")
  }

  const getStatusBadge = (commit: Commit) => {
    if (!commit.submitted) {
      return (
        <Badge variant="outline" className="border-slate-700 text-slate-300">
          Not Submitted
        </Badge>
      )
    }

    switch (commit.submissionStatus) {
      case "pending":
        return (
          <Badge variant="outline" className="border-amber-700/50 text-amber-400">
            Pending Review
          </Badge>
        )
      case "accepted":
        return (
          <Badge variant="outline" className="border-green-700/50 text-green-400">
            Accepted
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="border-red-700/50 text-red-400">
            Rejected
          </Badge>
        )
      default:
        return null
    }
  }

  const getStatusIcon = (commit: Commit) => {
    if (!commit.submitted) return null

    switch (commit.submissionStatus) {
      case "accepted":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  return (
    <main className="relative z-10 flex-1 p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
          Your Commits
        </h1>
      </div>

      <div className="grid gap-4">
        {commits.map((commit) => (
          <Card key={commit.id} className="overflow-hidden border-slate-800/50 bg-slate-900/50 text-white">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <GitCommit className="mr-2 h-5 w-5 text-cyan-400" />
                  <div>
                    <CardTitle className="flex items-center">
                      {getStatusIcon(commit)}
                      <span className={commit.submissionStatus ? "ml-2" : ""}>{commit.message}</span>
                    </CardTitle>
                    <CardDescription className="mt-1 text-slate-400">
                      <code className="bg-slate-800 px-2 py-1 rounded text-xs mr-2">{commit.hash}</code>
                      <span>{formatDate(commit.date)}</span>
                    </CardDescription>
                  </div>
                </div>
                {getStatusBadge(commit)}
              </div>
            </CardHeader>
            <CardContent>
              {commit.feedback && (
                <div className="mt-2 p-3 bg-slate-800/50 rounded-md border border-slate-700/50">
                  <p className="text-sm text-slate-300">
                    <span className="font-semibold">Feedback:</span> {commit.feedback}
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t border-slate-800/50 bg-slate-900/80 px-6 py-3">
              <div className="flex items-center">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={`https://avatar.vercel.sh/${commit.author}`} />
                  <AvatarFallback className="bg-slate-700 text-slate-200">{getInitials(commit.author)}</AvatarFallback>
                </Avatar>
                <span className="text-xs text-slate-400">{commit.author}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-slate-300 hover:text-cyan-400"
                  onClick={() => window.open(commit.url, "_blank")}
                >
                  <ExternalLink className="mr-1 h-4 w-4" />
                  View Commit
                </Button>

                {!commit.submitted && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSubmitCommit(commit)}
                    className="border-slate-700 text-slate-300 hover:bg-cyan-900/30 hover:text-cyan-400 hover:border-cyan-700"
                  >
                    <Send className="mr-1 h-4 w-4" />
                    Submit
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          onEscapeKeyDown={(e) => {
            e.preventDefault()
          }}
          className="border-none bg-slate-950/50 backdrop-blur-xl text-white shadow-xl shadow-purple-900/10 pointer-events-auto"
        >
          <DialogHeader>
            <DialogTitle className="text-xl text-white tracking-tighter">Submit Commit for Review</DialogTitle>
            <DialogDescription className="text-slate-400 tracking-tight">
              Link this commit to a goal for review.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-slate-300">Commit Message</label>
              <div className="p-3 bg-slate-800/50 rounded-md border border-slate-700/50">
                <p className="text-sm text-slate-300">{selectedCommit?.message}</p>
                <code className="block mt-2 bg-slate-800 px-2 py-1 rounded text-xs">{selectedCommit?.hash}</code>
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-slate-300">Commit URL</label>
              <Input
                value={commitUrl}
                onChange={(e) => setCommitUrl(e.target.value)}
                placeholder="https://github.com/username/repo/commit/hash"
                className="border-slate-800/50 bg-slate-900/50 text-white focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-slate-300">Select Goal</label>
              <Select value={selectedGoal} onValueChange={setSelectedGoal}>
                <SelectTrigger className="border-slate-800/50 bg-slate-900/50 text-white">
                  <SelectValue placeholder="Select a goal" />
                </SelectTrigger>
                <SelectContent className="border-slate-800 bg-slate-900 text-white">
                  {goals
                    .filter((goal) => goal.status === "open")
                    .map((goal) => (
                      <SelectItem key={goal.id} value={goal.id}>
                        {goal.name} ({goal.featureName})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
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
              disabled={!selectedGoal}
              onClick={submitCommit}
            >
              <Send className="mr-2 h-4 w-4" />
              Submit for Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
