"use client"

import { Camera, Github, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { useState } from "react"
import { toast } from "sonner"

export default function ProfileClient({
    initialData,
}: {
    initialData: {
        name: string
        email: string
        ghusername: string
        role: string
    }
}) {
    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState(initialData.name)
    const [email, setEmail] = useState(initialData.email)

    const handleSaveProfile = async () => {
        toast.info(<div className="select-none">Save Your Data</div>)
    }
    const handleChangePassword = () => {
        toast.info(<div className="select-none">Change Your Password</div>)
    }

    const handleConnectToGH = () => {
        toast.info(<div className="select-none">Github Connection</div>)
    }

    const handleUploadPicture = () => {
        toast.info(<div className="select-none">Upload Picture</div>)
    }

    return (
        <main className="relative z-10 flex-1 p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 select-none">
                    Profile Settings
                </h1>
                <p className="text-slate-400 select-none">Manage your account settings and preferences</p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="backdrop-blur-md bg-slate-900 w-full max-w-3xl mx-auto shadow-sm transition-all">
                    <TabsTrigger
                        value="profile"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                    >
                        Profile
                    </TabsTrigger>

                    <TabsTrigger
                        value="security"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                    >
                        Security
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
                        <Card className="rounded-xl backdrop-blur-xl bg-transparent border border-white/10 shadow-lg hover:shadow-xl transition duration-300">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-white text-lg font-semibold tracking-tight select-none">Profile Picture</CardTitle>
                                <CardDescription className="text-slate-400 text-sm tracking-tighter select-none">This will be displayed on your profile</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center space-y-4">
                                <div className="rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 p-1">
                                    <Avatar className="h-32 w-32 border-2 border-slate-900">
                                        <AvatarImage src="/placeholder.svg" alt={name} />
                                        <AvatarFallback className="text-2xl bg-slate-900 text-white select-none">
                                            {name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                <Button
                                    className="bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-indigo-400"
                                    onClick={handleUploadPicture}
                                >
                                    <Camera className="mr-2 h-4 w-4" />
                                    Change Picture
                                </Button>
                            </CardContent>
                        </Card>
                        <Card className="rounded-xl backdrop-blur-xl bg-transparent border border-white/10 shadow-lg hover:shadow-xl transition duration-300">
                            <CardHeader>
                                <CardTitle className="text-white text-lg font-semibold tracking-tight select-none">Personal Information</CardTitle>
                                <CardDescription className="text-slate-400 text-sm tracking-tighter select-none">Update your personal details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-slate-300">
                                        Full Name
                                    </Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="border-slate-800 bg-slate-950/50 text-white focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-slate-300">
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="border-slate-800 bg-slate-950/50 text-white focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role" className="text-slate-300">
                                        Role
                                    </Label>
                                    <Input
                                        id="role"
                                        value={initialData.role}
                                        disabled
                                        className="border-slate-800 bg-slate-950/50 text-slate-500 select-none"
                                    />
                                    <p className="text-xs text-slate-500">Your role cannot be changed</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="github" className="text-slate-300 select-none">
                                        GitHub Username
                                    </Label>
                                    <div className="flex">
                                        <div className="flex items-center px-3 border border-r-0 rounded-l-md border-slate-800 bg-slate-900 text-slate-400">
                                            <Github className="h-4 w-4" />
                                        </div>
                                        <Input
                                            id="github"
                                            value={initialData.ghusername}
                                            disabled
                                            className="rounded-l-none border-slate-800 bg-slate-950/50 text-white focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    onClick={handleSaveProfile}
                                    disabled={isLoading}
                                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white border-0"
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    {isLoading ? (
                                        <div className="flex items-center">
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
                                            Saving...
                                        </div>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="security">
                    <Card className="rounded-xl backdrop-blur-xl bg-transparent border border-white/10 shadow-lg hover:shadow-xl transition duration-300">

                        <CardHeader>
                            <CardTitle className="text-white text-lg font-semibold tracking-tight select-none">Security Settings</CardTitle>
                            <CardDescription className="text-slate-400 text-sm tracking-tighter select-none">Manage your account security</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-slate-300">Password</Label>
                                <div className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-950/50 px-4 py-2">
                                    <span className="text-slate-400 select-none">••••••••••••</span>
                                    <Button
                                        variant="ghost"
                                        onClick={handleChangePassword}
                                        className="text-indigo-400 hover:text-indigo-400 hover:bg-indigo-900/50"
                                    >
                                        Change
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-300">Connected Accounts</Label>
                                <div className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-950/50 px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-indigo-500/20 p-2 rounded-lg">
                                            <Github className="h-5 w-5 text-indigo-400" />
                                        </div>
                                        <div className="flex grid-cols-2 space-x-3">
                                            <p className="text-sm text-slate-400 font-bold tracking-wider select-none">GitHub</p>
                                            <span className="text-sm text-cyan-700 font-sans tracking-wider">{initialData.ghusername}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </main>
    )
}
