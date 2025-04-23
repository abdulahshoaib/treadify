"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, KeyRound, UserIcon, Loader2, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function LoginPage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [available, setIsAvailable] = useState<boolean | null>(null)
    const [checking, setChecking] = useState(false)

    const router = useRouter()

    useEffect(() => {
        if (!username) {
            setIsAvailable(null)
            return
        }

        const delay = setTimeout(async () => {
            setChecking(true)
            try {
                const res = await fetch(`http://localhost:5000/auth/checkUsername/${username}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json", },
                    credentials: "include"
                })

                if (!res.ok) {
                    setIsAvailable(true)
                    return
                }

                const data = await res.json()
                setIsAvailable(data.available)
            } catch (err: any) {
                console.error(err)
            } finally {
                setChecking(false)
            }
        }, 500)

        return () => clearTimeout(delay)
    }, [username])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const res = await fetch("http://localhost:5000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username: username, pass: password }),
                credentials: "include"
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || "Login failed")
                setIsLoading(false)
                setPassword("")
            } else {
                toast.success("Login successful: " + data.redirect)
                router.push(data.redirect)
            }
        } catch (err: any) {
            console.log("Login error:", err)
            setError(err.message)
        } finally {
            setIsLoading(false)
            setPassword("")
        }
    }

    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row">
            {/* Left side - decorative */}
            <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 p-8 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-[20%] left-[10%] w-64 h-64 rounded-full bg-purple-600 blur-3xl"></div>
                    <div className="absolute bottom-[30%] right-[15%] w-72 h-72 rounded-full bg-blue-600 blur-3xl"></div>
                    <div className="absolute top-[60%] left-[30%] w-80 h-80 rounded-full bg-cyan-600 blur-3xl"></div>
                </div>
                <div className="relative z-10 flex flex-col justify-center h-full text-white">
                    <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
                        Treadify
                    </h1>
                    <p className="text-2xl font-light mb-8 max-w-md">
                        Streamline your product development workflow with our collaborative platform.
                    </p>
                    <div className="space-y-6">
                        <div className="flex items-start space-x-3">
                            <div className="bg-indigo-500/20 p-2 rounded-lg">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-indigo-400"
                                >
                                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                                    <path d="m9 12 2 2 4-4"></path>
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-medium text-lg text-indigo-300">Role-Based Dashboards</h3>
                                <p className="text-slate-300 text-sm">Tailored experiences for every team member</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="bg-purple-500/20 p-2 rounded-lg">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-purple-400"
                                >
                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-medium text-lg text-purple-300">Real-Time Updates</h3>
                                <p className="text-slate-300 text-sm">Stay in sync with your team's progress</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="bg-cyan-500/20 p-2 rounded-lg">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-cyan-400"
                                >
                                    <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"></path>
                                    <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path>
                                    <path d="M12 2v2"></path>
                                    <path d="M12 22v-2"></path>
                                    <path d="m17 20.66-1-1.73"></path>
                                    <path d="M11 10.27 7 3.34"></path>
                                    <path d="m20.66 17-1.73-1"></path>
                                    <path d="m3.34 7 1.73 1"></path>
                                    <path d="M14 12h8"></path>
                                    <path d="M2 12h2"></path>
                                    <path d="m20.66 7-1.73 1"></path>
                                    <path d="m3.34 17 1.73-1"></path>
                                    <path d="m17 3.34-1 1.73"></path>
                                    <path d="m7 20.66 1-1.73"></path>
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-medium text-lg text-cyan-300">Seamless Integration</h3>
                                <p className="text-slate-300 text-sm">Connect with your favorite development tools</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - login form */}
            <div className="flex-1 flex items-center justify-center p-6 bg-slate-950">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-blue-300 mb-2">Welcome back</h2>
                        <p className="text-slate-400">Sign in to your Treadify account</p>
                    </div>

                    <Card className="border-0 bg-slate-900/50 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden">
                        <form onSubmit={handleSubmit}>
                            <CardContent className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="username" className="text-slate-300 flex items-center gap-2">
                                        <UserIcon className="h-4 w-4 text-slate-400" />
                                        Username
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="username"
                                            type="username"
                                            placeholder="username"
                                            value={username}
                                            onChange={(e) => {
                                                const value = e.target.value
                                                    .toLowerCase()
                                                    .replace(/[^a-z0-9]/g, "")
                                                setUsername(value)
                                            }}
                                            required
                                            className="border-slate-800 bg-slate-950/50 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500 pr-10 h-12"
                                        />
                                        <div className="absolute inset-y-0 right-3 flex items-center">
                                            {checking ? (
                                                <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
                                            ) : available === false ? (
                                                <CheckCircle className="h-5 w-5 text-green-500" />
                                            ) : available === true ? (
                                                <XCircle className="h-5 w-5 text-red-500" />
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password" className="text-slate-300 flex items-center gap-2">
                                            <KeyRound className="h-4 w-4 text-slate-400" />
                                            Password
                                        </Label>
                                    </div>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            disabled={isLoading || available === null || available}
                                            required
                                            className="border-slate-800 bg-slate-950/50 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500 pr-10 h-12"
                                        />
                                        {error && (
                                            <div className="text-sm text-red-500 mt-2 ml-2">
                                                {error}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="p-6 pt-0 flex flex-col space-y-4">
                                <Button
                                    type="submit"
                                    className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-lg"
                                    disabled={isLoading || available || !password}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center">
                                            <svg
                                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Logging in...
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center">
                                            Sign in
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </div>
                                    )}
                                </Button>
                                <div className="text-center text-sm text-slate-400">
                                    Don&apos;t have an account?{" "}
                                    <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium">
                                        Create account
                                    </Link>
                                </div>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    )
}
