"use client"

import { useState } from "react"
import { CheckCircle, XCircle, ExternalLink, GitCommit, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

type Submission = {
    id: string
    commitHash: string
    commitMessage: string
    commitUrl: string
    submittedAt: string
    status: "pending" | "accepted" | "rejected"
    feedback: string | null
    goalId: string
    goalName: string
    featureId: string
    featureName: string
    submittedBy: string
}

interface ReviewClientProps {
  initialSubmissions?: Submission[]
}

export default function ReviewClient({ initialSubmissions = [] }: ReviewClientProps) {
    const [submissions, setSubmissions] = useState<Submission[]>(Array.isArray(initialSubmissions) ? initialSubmissions : [])
    const [activeTab, setActiveTab] = useState("pending")
    const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false)
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
    const [feedback, setFeedback] = useState("")

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

    const handleReview = (submission: Submission, action: "accept" | "reject") => {
        setSelectedSubmission(submission)
        setFeedback("")
        setFeedbackDialogOpen(true)

        // Pre-populate with a template based on action
        if (action === "accept") {
            setFeedback("Great work! ")
        } else {
            setFeedback("This submission needs improvement. ")
        }
    }

    const submitReview = (action: "accept" | "reject") => {
        if (!selectedSubmission) return

        if (!feedback.trim()) {
            toast.error("Please provide feedback before submitting your review")
            return
        }

        const updatedStatus = action === "accept" ? "accepted" : "rejected"

        setSubmissions((prev) =>
            prev.map((sub) =>
                sub.id === selectedSubmission.id
                    ? { ...sub, status: updatedStatus, feedback }
                    : sub,
            ),
        )

        setFeedbackDialogOpen(false)
        toast.success(`Submission ${updatedStatus === "accepted" ? "accepted" : "rejected"} successfully`)
    }

    const filteredSubmissions = submissions.filter((sub) => {
        if (activeTab === "all") return true
        return sub.status === activeTab
    })

    return (
        <main className="relative z-10 flex-1 p-6">

            <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8 bg-slate-900/50 border border-slate-800/50">
                    <TabsTrigger value="pending" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white">
                        Pending
                        <Badge variant="secondary" className="ml-2 bg-amber-500/20 text-amber-400 border-amber-600/30">
                            {submissions.filter((s) => s.status === "pending").length}
                        </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="accepted" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white">
                        Accepted
                        <Badge variant="secondary" className="ml-2 bg-green-500/20 text-green-400 border-green-600/30">
                            {submissions.filter((s) => s.status === "accepted").length}
                        </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="rejected" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white">
                        Rejected
                        <Badge variant="secondary" className="ml-2 bg-red-500/20 text-red-400 border-red-600/30">
                            {submissions.filter((s) => s.status === "rejected").length}
                        </Badge>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="mt-0">
                    {filteredSubmissions.length === 0 ? (
                        <div className="mt-16 flex flex-col items-center justify-center">
                            <div className="max-w-md text-center mb-8">
                                <h2 className="text-2xl font-bold text-white mb-4 tracking-tighter">No Pending Submissions</h2>
                                <p className="text-slate-400 mb-6">There are no pending submissions to review at this time.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredSubmissions.map((submission) => (
                                <Card key={submission.id} className="overflow-hidden border-slate-800/50 bg-slate-900/50 text-white">
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="flex items-center">
                                                    <GitCommit className="mr-2 h-5 w-5 text-cyan-400" />
                                                    {submission.commitMessage}
                                                </CardTitle>
                                                <CardDescription className="mt-1 text-slate-400">
                                                    <Badge variant="outline" className="mr-2 border-slate-700 text-slate-300">
                                                        <Tag className="mr-1 h-3 w-3" />
                                                        {submission.featureName}
                                                    </Badge>
                                                    <Badge variant="outline" className="border-slate-700 text-slate-300">
                                                        Goal: {submission.goalName}
                                                    </Badge>
                                                </CardDescription>
                                            </div>
                                            <Badge
                                                variant={
                                                    submission.status === "pending"
                                                        ? "outline"
                                                        : submission.status === "accepted"
                                                            ? "success"
                                                            : "destructive"
                                                }
                                                className="ml-auto bg-transparent border-amber-600 text-amber-400"
                                            >
                                                {submission.status === "pending" && "Pending Review"}
                                                {submission.status === "accepted" && "Accepted"}
                                                {submission.status === "rejected" && "Rejected"}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center text-sm text-slate-400 mb-4">
                                            <code className="bg-slate-800 px-2 py-1 rounded text-xs mr-2">{submission.commitHash}</code>
                                            <span>Submitted {formatDate(submission.submittedAt)}</span>
                                        </div>

                                        {submission.feedback && (
                                            <div className="mt-2 p-3 bg-slate-800/50 rounded-md border border-slate-700/50">
                                                <p className="text-sm text-slate-300">
                                                    <span className="font-semibold">Feedback:</span> {submission.feedback}
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                    <CardFooter className="flex justify-between border-t border-slate-800/50 bg-slate-900/80 px-6 py-3">
                                        <div className="flex items-center">
                                            <Avatar className="h-6 w-6 mr-2">
                                                <AvatarImage src={`https://avatar.vercel.sh/${submission.submittedBy}`} />
                                                <AvatarFallback className="bg-slate-700 text-slate-200">
                                                    {getInitials(submission.submittedBy)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-xs text-slate-400">{submission.submittedBy}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-slate-300 hover:text-cyan-400 bg-slate-950 border-none hover:bg-gray-600"
                                                onClick={() => window.open(submission.commitUrl, "_blank")}
                                            >
                                                <ExternalLink className="mr-1 h-4 w-4" />
                                                View Code
                                            </Button>

                                            {submission.status === "pending" && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleReview(submission, "reject")}
                                                        className="border-slate-700 text-slate-400 hover:bg-red-900/30 hover:text-red-400 hover:border-red-700 bg-slate-900/40 "
                                                    >
                                                        <XCircle className="mr-1 h-4 w-4" />
                                                        Reject
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleReview(submission, "accept")}
                                                        className="border-slate-700 text-slate-400 hover:bg-green-900/30 hover:text-green-400 hover:border-green-700 bg-transparent"
                                                    >
                                                        <CheckCircle className="mr-1 h-4 w-4" />
                                                        Accept
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="accepted" className="mt-0">
                    {filteredSubmissions.length === 0 ? (
                        <div className="mt-16 flex flex-col items-center justify-center">
                            <div className="max-w-md text-center mb-8">
                                <h2 className="text-2xl font-bold text-white mb-4 tracking-tighter">No Accepted Submissions</h2>
                                <p className="text-slate-400 mb-6">There are no accepted submissions yet.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredSubmissions.map((submission) => (
                                <Card key={submission.id} className="overflow-hidden border-slate-800/50 bg-slate-900/50 text-white">
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="flex items-center">
                                                    <GitCommit className="mr-2 h-5 w-5 text-cyan-400" />
                                                    {submission.commitMessage}
                                                </CardTitle>
                                                <CardDescription className="mt-1 text-slate-400">
                                                    <Badge variant="outline" className="mr-2 border-slate-700 text-slate-300">
                                                        <Tag className="mr-1 h-3 w-3" />
                                                        {submission.featureName}
                                                    </Badge>
                                                    <Badge variant="outline" className="border-slate-700 text-slate-300">
                                                        Goal: {submission.goalName}
                                                    </Badge>
                                                </CardDescription>
                                            </div>
                                            <Badge variant="default" className="ml-auto bg-green-800">
                                                Accepted
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center text-sm text-slate-400 mb-4">
                                            <code className="bg-slate-800 px-2 py-1 rounded text-xs mr-2">{submission.commitHash}</code>
                                            <span>Submitted {formatDate(submission.submittedAt)}</span>
                                        </div>

                                        {submission.feedback && (
                                            <div className="mt-2 p-3 bg-slate-800/50 rounded-md border border-slate-700/50">
                                                <p className="text-sm text-slate-300">
                                                    <span className="font-semibold">Feedback:</span> {submission.feedback}
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                    <CardFooter className="flex justify-between border-t border-slate-800/50 bg-slate-900/80 px-6 py-3">
                                        <div className="flex items-center">
                                            <Avatar className="h-6 w-6 mr-2">
                                                <AvatarImage src={`https://avatar.vercel.sh/${submission.submittedBy}`} />
                                                <AvatarFallback className="bg-slate-700 text-slate-200">
                                                    {getInitials(submission.submittedBy)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-xs text-slate-400">{submission.submittedBy}</span>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-slate-300 hover:text-cyan-400 bg-slate-950 border-none hover:bg-gray-600"
                                            onClick={() => window.open(submission.commitUrl, "_blank")}
                                        >
                                            <ExternalLink className="mr-1 h-4 w-4" />
                                            View Code
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="rejected" className="mt-0">
                    {filteredSubmissions.length === 0 ? (
                        <div className="mt-16 flex flex-col items-center justify-center">
                            <div className="max-w-md text-center mb-8">
                                <h2 className="text-2xl font-bold text-white mb-4 tracking-tighter">No Rejected Submissions</h2>
                                <p className="text-slate-400 mb-6">There are no rejected submissions.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredSubmissions.map((submission) => (
                                <Card key={submission.id} className="overflow-hidden border-slate-800/50 bg-slate-900/50 text-white">
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="flex items-center">
                                                    <GitCommit className="mr-2 h-5 w-5 text-cyan-400" />
                                                    {submission.commitMessage}
                                                </CardTitle>
                                                <CardDescription className="mt-1 text-slate-400">
                                                    <Badge variant="outline" className="mr-2 border-slate-700 text-slate-300">
                                                        <Tag className="mr-1 h-3 w-3" />
                                                        {submission.featureName}
                                                    </Badge>
                                                    <Badge variant="outline" className="border-slate-700 text-slate-300">
                                                        Goal: {submission.goalName}
                                                    </Badge>
                                                </CardDescription>
                                            </div>
                                            <Badge variant="destructive" className="ml-auto">
                                                Rejected
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center text-sm text-slate-400 mb-4">
                                            <code className="bg-slate-800 px-2 py-1 rounded text-xs mr-2">{submission.commitHash}</code>
                                            <span>Submitted {formatDate(submission.submittedAt)}</span>
                                        </div>

                                        {submission.feedback && (
                                            <div className="mt-2 p-3 bg-slate-800/50 rounded-md border border-slate-700/50">
                                                <p className="text-sm text-slate-300">
                                                    <span className="font-semibold">Feedback:</span> {submission.feedback}
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                    <CardFooter className="flex justify-between border-t border-slate-800/50 bg-slate-900/80 px-6 py-3">
                                        <div className="flex items-center">
                                            <Avatar className="h-6 w-6 mr-2">
                                                <AvatarImage src={`https://avatar.vercel.sh/${submission.submittedBy}`} />
                                                <AvatarFallback className="bg-slate-700 text-slate-200">
                                                    {getInitials(submission.submittedBy)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-xs text-slate-400">{submission.submittedBy}</span>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-slate-300 hover:text-cyan-400 bg-slate-950 border-none hover:bg-gray-600"
                                            onClick={() => window.open(submission.commitUrl, "_blank")}
                                        >
                                            <ExternalLink className="mr-1 h-4 w-4" />
                                            View Code
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
                <DialogContent
                    onEscapeKeyDown={(e) => {
                        e.preventDefault()
                    }}
                    className="border-none bg-slate-950/50 backdrop-blur-xl text-white shadow-xl shadow-purple-900/10 pointer-events-auto"
                >
                    <DialogHeader>
                        <DialogTitle className="text-xl text-white tracking-tighter">Provide Feedback</DialogTitle>
                        <DialogDescription className="text-slate-400 tracking-tight">
                            Add feedback for the submission before finalizing your review.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Enter your feedback..."
                            className="border-slate-800/50 bg-slate-900/50 text-white focus:border-cyan-500 focus:ring-cyan-500 min-h-[120px]"
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setFeedbackDialogOpen(false)}
                            className="border-slate-800 bg-transparent text-white hover:bg-red-900/30 hover:text-red-500 hover:border-red-700 select-none"
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white border-0 select-none"
                            onClick={() => submitReview("reject")}
                        >
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject
                        </Button>
                        <Button
                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white border-0 select-none"
                            onClick={() => submitReview("accept")}
                        >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Accept
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </main>
    )
}
