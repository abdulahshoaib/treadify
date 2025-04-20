"use client"

import { useParams } from 'next/navigation'
import { useState } from "react"
import { Code, Github } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import Link from "next/link"

export default function TLDashboard() {
    const [productChannel, setProductChannel] = useState(null)
    const [featureChannel, setFeatureChannel] = useState(null)
    const [joinCode, setJoinCode] = useState("")
    const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false)

    const params = useParams()
    const username = params.username as string

    if (!username)
        throw new Error("Username Undefined")

    const handleJoinChannel = () => { }

    return (
        <main className="relative z-10 flex-1 p-6 select-none">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                    Dashboard
                </h1>
            </div>

            {!productChannel ? (
                <div className="mt-16 flex flex-col items-center justify-center">
                    <div className="max-w-md text-center mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">Not Assigned to a Product</h2>
                        <p className="text-slate-400 mb-6">
                            You haven't been assigned to a product channel yet. Join a product channel using a join code from a Product Manager.
                        </p>
                        <Button
                            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 shadow-lg shadow-blue-900/20 px-8 py-6 text-lg transition-all ease-in-out"
                            onClick={() => setIsJoinDialogOpen(true)}
                        >
                            <Code className="mr-2 h-5 w-5" />
                            Join Product Channel
                        </Button>
                    </div>
                </div>
            ) : (
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
                                    <span className="text-white">{productChannel.progress}%</span>
                                </div>
                                <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-800/80 p-0.5">
                                    <div
                                        className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_5px_rgba(0,255,255,0.5)]"
                                        style={{ width: `${productChannel.progress}%` }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Link href={`/dashboard/tl/product/${productChannel.id}`} className="w-full">
                                <Button
                                    variant="outline"
                                    className="w-full border-slate-800 bg-slate-900/30 text-white hover:text-cyan-400 hover:border-cyan-500/50 backdrop-blur-sm"
                                >
                                    View Product
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>

                    {featureChannel ? (
                        <Card className="border-slate-800/30 bg-slate-900/30 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-slate-700/50 group">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-slate-900/0 to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <CardHeader>
                                <CardTitle className="text-xl text-white">{featureChannel.name}</CardTitle>
                                <CardDescription className="text-slate-400">{featureChannel.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-400">Progress</span>
                                        <span className="text-white">{featureChannel.progress}%</span>
                                    </div>
                                    <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-800/80 p-0.5">
                                        <div
                                            className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_5px_rgba(0,255,255,0.5)]"
                                            style={{ width: `${featureChannel.progress}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400">Goals: {featureChannel.completedGoals}/{featureChannel.totalGoals}</span>
                                    <span className="text-slate-400">Deadline: {featureChannel.deadline}</span>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Link href={`/dashboard/tl/feature/${featureChannel.id}`} className="w-full">
                                    <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 shadow-lg shadow-blue-900/20">
                                        Manage Feature
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ) : (
                        <Card className="border-slate-800/30 bg-slate-900/30 backdrop-blur-md shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-white">Feature Channel</CardTitle>
                                <CardDescription className="text-slate-400">
                                    You haven't been assigned to a feature channel yet
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center py-6">
                                <p className="text-slate-400 mb-4">Wait for a Product Manager to assign you to a feature channel</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}

            {/* Join Dialog */}
            <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
                <DialogContent className="border-none bg-slate-950/30 backdrop-blur-xl text-white shadow-xl shadow-purple-900/10 select-none">
                    <DialogHeader>
                        <DialogTitle className="text-xl tracking-tight text-white">Join Product Channel</DialogTitle>
                        <DialogDescription className="text-slate-400 tracking-tight">
                            Enter the join code provided by your Product Manager.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="join-code" className="text-slate-300 tracking-tighter">
                                Join Code
                            </Label>
                            <Input
                                id="join-code"
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value)}
                                placeholder="Enter join code (e.g., TREAD-123)"
                                className="border-slate-800/60 bg-slate-900/50 text-white focus:border-cyan-500 focus:ring-cyan-500"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsJoinDialogOpen(false)}
                            className="border-slate-800 bg-transparent text-white hover:bg-red-900/30 hover:text-red-500 hover:border-red-700"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleJoinChannel}
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0"
                        >
                            Join
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </main>
    )
}

