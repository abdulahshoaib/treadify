"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, KeyRound, Mail, User, UserCog, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function SignupPage() {
    const router = useRouter()
    const [username, setUsername] = useState("")
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
    const [checking, setChecking] = useState(false)
    const [fname, setFName] = useState("")
    const [lname, setLName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("developer")
    const [isLoading, setIsLoading] = useState(false)

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
                    headers: {
                        "Content-Type": "application/json",
                    },
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
            const res = await fetch("http://localhost:5000/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    FirstName: fname,
                    LastName: lname,
                    email,
                    username,
                    pass: password,
                    role,
                }),
                credentials: "include"
            })

            const data = await res.json()

            if (!res.ok) {
                alert("Error creating account")
            }
            else {
                console.log(data)
            }

        } catch (err: any) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row">
            {/* Left side - signup form */}
            <div className="flex-1 flex items-center justify-center p-6 bg-slate-950 order-2 md:order-1">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">Join Treadify</h2>
                        <p className="text-slate-400">Create your account and start collaborating</p>
                    </div>

                    <Card className="border-0 bg-slate-900/50 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden">
                        <form onSubmit={handleSubmit}>
                            <CardContent className="p-6 space-y-4">
                                {/* Username */}
                                <div className="space-y-2">
                                    <Label htmlFor="username" className="text-slate-300 flex items-center gap-2">
                                        <User className="h-4 w-4 text-slate-400" />
                                        Username
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="username"
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
                                            ) : isAvailable === true ? (
                                                <CheckCircle className="h-5 w-5 text-green-500" />
                                            ) : isAvailable === false ? (
                                                <XCircle className="h-5 w-5 text-red-500" />
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                                {/* First Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="fname" className="text-slate-300 flex items-center gap-2">
                                        <User className="h-4 w-4 text-slate-400" />
                                        First Name
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="fname"
                                            placeholder="John"
                                            value={fname}
                                            onChange={(e) => setFName(e.target.value)}
                                            required
                                            className="border-slate-800 bg-slate-950/50 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500 pr-10 h-12"
                                        />
                                    </div>
                                </div>

                                {/* Last Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="lname" className="text-slate-300 flex items-center gap-2">
                                        <User className="h-4 w-4 text-slate-400" />
                                        Last Name
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="lname"
                                            placeholder="Doe"
                                            value={lname}
                                            onChange={(e) => setLName(e.target.value)}
                                            required
                                            className="border-slate-800 bg-slate-950/50 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500 pr-10 h-12"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-slate-300 flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-slate-400" />
                                        Email
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="border-slate-800 bg-slate-950/50 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500 pr-10 h-12"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-slate-300 flex items-center gap-2">
                                        <KeyRound className="h-4 w-4 text-slate-400" />
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="border-slate-800 bg-slate-950/50 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500 pr-10 h-12"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300 flex items-center gap-2">
                                        <UserCog className="h-4 w-4 text-slate-400" />
                                        Role
                                    </Label>
                                    <RadioGroup value={role} onValueChange={setRole} className="grid grid-cols-1 gap-2 pt-2">
                                        <label
                                            htmlFor="pm"
                                            className="flex items-center space-x-2 rounded-lg border border-slate-800 p-3 transition-colors hover:bg-slate-900 cursor-pointer"
                                        >
                                            <RadioGroupItem value="productmanager" id="pm" className="border-slate-600 text-indigo-400" />
                                            <span className="flex-1 font-normal text-slate-300">Product Manager</span>
                                        </label>

                                        <label
                                            htmlFor="tl"
                                            className="flex items-center space-x-2 rounded-lg border border-slate-800 p-3 transition-colors hover:bg-slate-900 cursor-pointer"
                                        >
                                            <RadioGroupItem value="technicallead" id="tl" className="border-slate-600 text-indigo-400" />
                                            <span className="flex-1 font-normal text-slate-300">Technical Lead</span>
                                        </label>

                                        <label
                                            htmlFor="dev"
                                            className="flex items-center space-x-2 rounded-lg border border-slate-800 p-3 transition-colors hover:bg-slate-900 cursor-pointer"
                                        >
                                            <RadioGroupItem value="developers" id="dev" className="border-slate-600 text-indigo-400" />
                                            <span className="flex-1 font-normal text-slate-300">Developer</span>
                                        </label>
                                    </RadioGroup>
                                </div>
                            </CardContent>
                            <CardFooter className="p-6 pt-0 flex flex-col space-y-4">
                                <Button
                                    type="submit"
                                    className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-lg"
                                    disabled={isLoading || !isAvailable || checking || !username || !fname || !lname || !email || !password}
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
                                            Creating account...
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center">
                                            Create account
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </div>
                                    )}
                                </Button>
                                <div className="text-center text-sm text-slate-400">
                                    Already have an account?{" "}
                                    <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
                                        Sign in
                                    </Link>
                                </div>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>

            {/* Right side - decorative */}
            <div className="hidden md:flex md:w-1/2 bg-gradient-to-bl from-indigo-950 via-slate-900 to-purple-950 p-8 relative overflow-hidden order-1 md:order-2">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-[20%] right-[10%] w-64 h-64 rounded-full bg-purple-600 blur-3xl"></div>
                    <div className="absolute bottom-[30%] left-[15%] w-72 h-72 rounded-full bg-blue-600 blur-3xl"></div>
                    <div className="absolute top-[60%] right-[30%] w-80 h-80 rounded-full bg-cyan-600 blur-3xl"></div>
                </div>
                <div className="relative z-10 flex flex-col justify-center h-full text-white">
                    <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
                        Treadify
                    </h1>
                    <p className="text-2xl font-light mb-8 max-w-md">
                        Join thousands of teams who trust Treadify to manage their product development.
                    </p>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-4 rounded-xl border border-slate-700/30">
                            <div className="text-4xl font-bold text-indigo-400 mb-2">500+</div>
                            <div className="text-slate-300">Teams using Treadify</div>
                        </div>
                        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-4 rounded-xl border border-slate-700/30">
                            <div className="text-4xl font-bold text-purple-400 mb-2">10k+</div>
                            <div className="text-slate-300">Projects completed</div>
                        </div>
                        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-4 rounded-xl border border-slate-700/30">
                            <div className="text-4xl font-bold text-cyan-400 mb-2">98%</div>
                            <div className="text-slate-300">Customer satisfaction</div>
                        </div>
                        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-4 rounded-xl border border-slate-700/30">
                            <div className="text-4xl font-bold text-indigo-400 mb-2">24/7</div>
                            <div className="text-slate-300">Customer support</div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
