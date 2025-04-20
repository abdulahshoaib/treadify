"use client"

import { useState } from "react"
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { GithubRepos } from "./github-repos"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/date-picker"
import { toast } from "sonner"
import { createProductChannel } from "@/lib/createProductChannel"

interface Repo {
    name: string
}

interface PMDashboardProps {
    repos: Repo[]
}

function DatetoString(date: Date | undefined): string {
    if (!date)
        return ""
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const formattedDate = `${year}-${month}-${day}`
    return formattedDate
}

export default function PMDashboard({ repos }: PMDashboardProps) {
    const [newChannelName, setNewChannelName] = useState("")
    const [newChannelRepo, setNewChannelRepo] = useState("")
    const [productChannel, setNewProductChannel] = useState("")
    const [newChannelDeadline, setNewChannelDeadline] = useState<Date | undefined>(undefined)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    async function handleCreate() {
        try {
            toast(`${newChannelRepo}`)
            const data = await createProductChannel(
                newChannelName,
                newChannelRepo,
                DatetoString(newChannelDeadline)
            )
            setNewProductChannel(data.name)
            setIsDialogOpen(false)
            toast.success("Product channel created!")
        } catch (err: any) {
            toast.error(err.error || "Failed to create product channel")
        }
    }

    return (
        <main className="relative z-10 flex-1 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                    Dashboard
                </h1>
            </div>

            {!productChannel && (
                <div className="mt-16 flex flex-col items-center justify-center">
                    <div className="max-w-md text-center mb-8">
                        <h2 className="text-4xl font-bold text-white mb-4 tracking-tighter">No Product Channel</h2>
                        <p className="text-slate-400 mb-6">
                            You haven't created a product channel yet. Create one to start managing your product development.
                        </p>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
                            <DialogTrigger asChild>
                                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 shadow-lg shadow-blue-900/20 px-8 py-6 text-lg tracking-tighter">
                                    <Plus className="mr-2 h-5 w-5" />
                                    Create Product Channel
                                </Button>
                            </DialogTrigger>
                            <DialogContent
                                onEscapeKeyDown={(e) => { e.preventDefault() }}
                                className="border-none bg-slate-950/50 backdrop-blur-xl text-white shadow-xl shadow-purple-900/10 pointer-events-auto"
                            >
                                <DialogHeader>
                                    <DialogTitle className="text-xl text-white tracking-tighter">Create New Product Channel</DialogTitle>
                                    <DialogDescription className="text-slate-400 tracking tight">
                                        Add a new product channel to track features and goals. GitHub repository connection is required.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name" className="text-slate-300">
                                            Product Name
                                        </Label>
                                        <Input
                                            id="name"
                                            value={newChannelName}
                                            onChange={(e) => setNewChannelName(e.target.value)}
                                            placeholder="Enter product name"
                                            className="border-slate-800/50 bg-slate-900/50 text-white focus:border-cyan-500 focus:ring-cyan-500"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="repo" className="text-slate-300">
                                            GitHub Repository
                                        </Label>
                                        <GithubRepos
                                            repos={repos}
                                            onSelectRepo={(repo: string) => {
                                                setNewChannelRepo(repo)
                                                setTimeout(() => toast(`PMDashboard - newChannelRepo state:", ${newChannelRepo}`), 0);
                                            }}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="deadline" className="text-slate-300">
                                            Deadline
                                        </Label>
                                        <DatePicker
                                            value={newChannelDeadline}
                                            onChange={setNewChannelDeadline}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onSubmit={() => setIsDialogOpen(false)}
                                        className="border-slate-800 bg-transparent text-white hover:bg-red-900/30 hover:text-red-500 hover:border-red-700 select-none"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 select-none"
                                        disabled={
                                            newChannelName.trim() === "" ||
                                            newChannelRepo.trim() === "" ||
                                            !newChannelDeadline
                                        }
                                        onClick={handleCreate}
                                    >
                                        Create
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            )}
        </main>
    )
}
