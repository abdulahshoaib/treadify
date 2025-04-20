"use client"

import { useState } from "react"
import { Code, Github } from "lucide-react"
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

export default function DevDashboard() {
    const [productChannel, setProductChannel] = useState(null)
    const [joinCode, setJoinCode] = useState("")
    const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false)

   // const handleJoinChannel = async () => {
   //     try {
   //         const res = await fetch(`http://localhost:5000/auth/validateCode`, {
   //             method: "POST",
   //             headers: { "Content-Type": "application/json" },
   //             body: JSON.stringify({ code: joinCode }),
   //             credentials: "include",
   //         })

   //         const data = await res.json()

   //         if (!res.ok)
   //             alert("Invalid join code. Please check and try again.")

   //         // set the user dashboard
   //         else {
   //             setIsJoinDialogOpen(false)
   //         }

   //         setJoinCode("")
   //     } catch (error) {
   //         console.error("Error joining channel:", error)
   //         alert("Failed to join channel. Please try again.")
   //     }
   // }

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
                        <h2 className="text-2xl font-bold text-white mb-4">Not Assigned to a Channel</h2>
                        <p className="text-slate-400 mb-6">
                            You haven't been assigned to any feature channel yet. Join a channel using a join code from your
                            Technical Lead.
                        </p>
                        <Button
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 shadow-lg shadow-blue-900/20 px-8 py-6 text-lg"
                            onClick={() => setIsJoinDialogOpen(true)}
                        >
                            <Code className="mr-2 h-5 w-5" />
                            Join Channel
                        </Button>
                    </div>
                </div>
            )}
        </main>
    )
}
