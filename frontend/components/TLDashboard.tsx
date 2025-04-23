"use client"

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
    DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function TLDashboard() {
    const [productChannel, setProductChannel] = useState(null)
    const [featureChannel, setFeatureChannel] = useState(null)
    const [joinCode, setJoinCode] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handleJoinChannel = () => {

    }
    const handleClick = () => {
    }

    return (
        <main className="relative z-10 flex-1 p-6 select-none">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                    Dashboard
                </h1>
            </div>

            {!productChannel && (
                <div className="mt-16 flex flex-col items-center justify-center">
                    <div className="max-w-md text-center mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Not Assigned to a Channel</h2>
                        <p className="text-slate-400 mb-6">
                            You haven't been assigned to any feature channel yet. Join a channel using a join code from your
                            Product Manager.
                        </p>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
                            <DialogTrigger asChild>
                                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 shadow-lg shadow-blue-900/20 px-8 py-6 text-lg tracking-tighter">
                                    <Code className="mr-2 h-5 w-5" />
                                    Join Channel
                                </Button>
                            </DialogTrigger>
                            <DialogContent
                                onEscapeKeyDown={(e) => { e.preventDefault() }}
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
            )}
        </main>
    )
}
