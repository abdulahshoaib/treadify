"use client"

import { useState } from "react"
import { Plus, Github, Code } from 'lucide-react'
import DashboardHeader from "@/components/dashboard-header"
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
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

interface Channel {
    id: string
    name: string
    repo: string
    deadline: string
    progress: number
    features: number
    href: string
    techLead: string
    completedGoals: number
    totalGoals: number
}

// Sample data for demonstration
const initialProductChannel = null;
const initialFeatureChannels: Channel[] = [];

export default function PMDashboard() {
    const [productChannel, setProductChannel] = useState<Channel| null>(initialProductChannel)
    const [featureChannels] = useState<Channel[]>(initialFeatureChannels)
    const [newChannelName, setNewChannelName] = useState("")
    const [newChannelRepo, setNewChannelRepo] = useState("")
    const [newChannelDeadline, setNewChannelDeadline] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handleCreateChannel = () => {
        const newChannel = {
            id: "prod-1",
            name: newChannelName,
            repo: newChannelRepo,
            deadline: newChannelDeadline,
            progress: 0,
            features: 0,
            href: `/dashboard/pm/channel/prod-1`,
            techLead: "John Doe",
            completedGoals: 0,
            totalGoals: 0,
        }

        setProductChannel(newChannel)
        setNewChannelName("")
        setNewChannelRepo("")
        setNewChannelDeadline("")
        setIsDialogOpen(false)
    }

    // Calculate overall progress
    const overallProgress = productChannel ? productChannel.progress : 0;

    return (
        <div className="flex min-h-screen flex-col bg-black text-white">
            {/* Background gradient effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] left-[15%] w-[40rem] h-[40rem] rounded-full bg-purple-600/30 blur-3xl opacity-20"></div>
                <div className="absolute bottom-[20%] right-[10%] w-[35rem] h-[35rem] rounded-full bg-blue-600/30 blur-3xl opacity-20"></div>
                <div className="absolute top-[60%] left-[40%] w-[30rem] h-[30rem] rounded-full bg-cyan-600/30 blur-3xl opacity-20"></div>
                <div className="absolute top-[30%] right-[25%] w-[25rem] h-[25rem] rounded-full bg-green-600/30 blur-3xl opacity-20"></div>
            </div>

            <DashboardHeader userName="Sarah Johnson" userRole="Product Manager" />
            <main className="relative z-10 flex-1 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                        Product Manager Dashboard
                    </h1>
                    {productChannel && (
                        <Button
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 shadow-lg shadow-blue-900/20"
                            onClick={() => setIsDialogOpen(true)}
                        >
                            <Code className="mr-2 h-4 w-4" />
                            Generate Join Code
                        </Button>
                    )}
                </div>

                {!productChannel ? (
                    <div className="mt-16 flex flex-col items-center justify-center">
                        <div className="max-w-md text-center mb-8">
                            <h2 className="text-2xl font-bold text-white mb-4">No Product Channel</h2>
                            <p className="text-slate-400 mb-6">
                                You haven't created a product channel yet. Create one to start managing your product development.
                            </p>
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 shadow-lg shadow-blue-900/20 px-8 py-6 text-lg">
                                        <Plus className="mr-2 h-5 w-5" />
                                        Create Product Channel
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="border-slate-800/50 bg-black/90 backdrop-blur-xl text-white shadow-xl shadow-purple-900/10">
                                    <DialogHeader>
                                        <DialogTitle className="text-xl text-white">Create New Product Channel</DialogTitle>
                                        <DialogDescription className="text-slate-400">
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
                                            <div className="flex">
                                                <div className="flex items-center px-3 border border-r-0 rounded-l-md border-slate-800 bg-slate-900 text-slate-400">
                                                    <Github className="h-4 w-4" />
                                                </div>
                                                <Input
                                                    id="repo"
                                                    value={newChannelRepo}
                                                    onChange={(e) => setNewChannelRepo(e.target.value)}
                                                    placeholder="username/repository"
                                                    className="rounded-l-none border-slate-800/50 bg-slate-900/50 text-white focus:border-cyan-500 focus:ring-cyan-500"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="deadline" className="text-slate-300">
                                                Deadline
                                            </Label>
                                            <Input
                                                id="deadline"
                                                type="date"
                                                value={newChannelDeadline}
                                                onChange={(e) => setNewChannelDeadline(e.target.value)}
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
                                            onClick={handleCreateChannel}
                                            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0"
                                        >
                                            Create
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="mt-8 grid gap-6 md:grid-cols-2">
                            <Card className="border-slate-800/30 bg-slate-900/30 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-slate-700/50 group">
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-slate-900/0 to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-xl text-white">{productChannel.name}</CardTitle>
                                        <div className="flex items-center gap-2">
                                            <div className="bg-slate-800/80 p-1.5 rounded-md">
                                                <Github className="h-4 w-4 text-cyan-400" />
                                            </div>
                                            <span className="text-sm text-slate-300">{productChannel.repo}</span>
                                        </div>
                                    </div>
                                    <CardDescription className="text-slate-400">
                                        Deadline: {productChannel.deadline}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-400">Overall Progress</span>
                                            <span className="text-white">{overallProgress}%</span>
                                        </div>
                                        <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-800/80 p-0.5">
                                            <div
                                                className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_5px_rgba(0,255,255,0.5)]"
                                                style={{ width: `${overallProgress}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <div className="text-slate-400">Features: {productChannel.features}</div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Link href={productChannel.href} className="w-full">
                                        <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 shadow-lg shadow-blue-900/20">
                                            Manage Product
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>

                            <Card className="border-slate-800/30 bg-slate-900/30 backdrop-blur-md shadow-xl">
                                <CardHeader>
                                    <CardTitle className="text-white">Feature Channels</CardTitle>
                                    <CardDescription className="text-slate-400">
                                        Overview of all feature channels in this product
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {featureChannels.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-6">
                                            <p className="text-slate-400 mb-4">No feature channels created yet</p>
                                            <Link href={productChannel.href}>
                                                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 shadow-lg shadow-blue-900/20">
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Add Feature Channel
                                                </Button>
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {featureChannels.map((feature) => (
                                                <div key={feature.id} className="space-y-2">
                                                    <div className="flex justify-between items-center">
                                                        <div className="font-medium text-white">{feature.name}</div>
                                                        <div className="text-sm text-slate-400">Lead: {feature.techLead}</div>
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="text-slate-400">Progress</span>
                                                        <span className="text-white">{feature.progress}%</span>
                                                    </div>
                                                    <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-slate-800/80 p-0.5">
                                                        <div
                                                            className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_5px_rgba(0,255,255,0.5)]"
                                                            style={{ width: `${feature.progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Feature Channels Section */}
                        <div className="mt-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-white">Feature Channels</h2>
                                <Link href={productChannel.href}>
                                    <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 shadow-lg shadow-blue-900/20">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Feature
                                    </Button>
                                </Link>
                            </div>

                            {featureChannels.length === 0 ? (
                                <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-slate-800/50 bg-slate-900/20 backdrop-blur-sm">
                                    <p className="text-sm text-slate-400">No feature channels created yet</p>
                                </div>
                            ) : (
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {featureChannels.map((feature) => (
                                        <Card
                                            key={feature.id}
                                            className="border-slate-800/30 bg-slate-900/30 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-slate-700/50 group"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-slate-900/0 to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                            <CardHeader>
                                                <CardTitle className="text-white">{feature.name}</CardTitle>
                                                <CardDescription className="text-slate-400">Lead: {feature.techLead}</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="flex items-center justify-between text-sm">
                                                    <div className="text-slate-400">Deadline: {feature.deadline}</div>
                                                    <div className="text-slate-400">Goals: {feature.completedGoals}/{feature.totalGoals}</div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-slate-400">Progress</span>
                                                        <span className="text-white">{feature.progress}%</span>
                                                    </div>
                                                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-800/80 p-0.5">
                                                        <div
                                                            className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_5px_rgba(0,255,255,0.5)]"
                                                            style={{ width: `${feature.progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                                <Link href={`/dashboard/pm/feature/${feature.id}`} className="block w-full">
                                                    <Button
                                                        variant="outline"
                                                        className="w-full border-slate-800 bg-slate-900/30 text-white hover:text-cyan-400 hover:border-cyan-500/50 backdrop-blur-sm"
                                                    >
                                                        View Details
                                                    </Button>
                                                </Link>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>
        </div>
    )
}
