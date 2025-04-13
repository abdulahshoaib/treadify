"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Camera, Github, Save } from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"

export default function ProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // User profile data
  const [name, setName] = useState("Jamie Smith")
  const [email, setEmail] = useState("jamie.smith@example.com")
  const [bio, setBio] = useState("Full-stack developer with 5 years of experience in React and Node.js.")
  const [github, setGithub] = useState("jamiesmith")
  const [role] = useState("Developer")

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [channelUpdates, setChannelUpdates] = useState(true)
  const [goalCompletions, setGoalCompletions] = useState(true)

  // Security settings
  const [twoFactorAuth, setTwoFactorAuth] = useState(false)

  const handleSaveProfile = () => {
    setIsLoading(true)

    // Simulate API call to save profile
    setTimeout(() => {
      setIsLoading(false)
      // Show success message or redirect
    }, 1000)
  }

  const handleChangePassword = () => {
    // In a real app, this would open a modal or redirect to change password page
    alert("Password change functionality would be implemented here")
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-white">
      {/* Background gradient effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[15%] w-[40rem] h-[40rem] rounded-full bg-purple-600/20 blur-3xl opacity-10"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[35rem] h-[35rem] rounded-full bg-blue-600/20 blur-3xl opacity-10"></div>
        <div className="absolute top-[60%] left-[40%] w-[30rem] h-[30rem] rounded-full bg-cyan-600/20 blur-3xl opacity-10"></div>
      </div>

      <DashboardHeader userName={name} userRole={role} />
      <main className="relative z-10 flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
          <p className="text-slate-400">Manage your account settings and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 p-1">
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              Notifications
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
              <Card className="border-slate-800/50 bg-slate-900/50 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="text-white">Profile Picture</CardTitle>
                  <CardDescription className="text-slate-400">This will be displayed on your profile</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                  <div className="rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 p-1">
                    <Avatar className="h-32 w-32 border-2 border-slate-900">
                      <AvatarImage src="/placeholder.svg" alt={name} />
                      <AvatarFallback className="text-2xl bg-slate-900 text-white">
                        {name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <Button className="bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-indigo-400">
                    <Camera className="mr-2 h-4 w-4" />
                    Change Picture
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-slate-800/50 bg-slate-900/50 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="text-white">Personal Information</CardTitle>
                  <CardDescription className="text-slate-400">Update your personal details</CardDescription>
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
                      value={role}
                      disabled
                      className="border-slate-800 bg-slate-950/50 text-slate-500"
                    />
                    <p className="text-xs text-slate-500">Your role cannot be changed</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-slate-300">
                      Bio
                    </Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="min-h-[100px] border-slate-800 bg-slate-950/50 text-white focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="github" className="text-slate-300">
                      GitHub Username
                    </Label>
                    <div className="flex">
                      <div className="flex items-center px-3 border border-r-0 rounded-l-md border-slate-800 bg-slate-900 text-slate-400">
                        <Github className="h-4 w-4" />
                      </div>
                      <Input
                        id="github"
                        value={github}
                        onChange={(e) => setGithub(e.target.value)}
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

          <TabsContent value="notifications">
            <Card className="border-slate-800/50 bg-slate-900/50 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">Notification Preferences</CardTitle>
                <CardDescription className="text-slate-400">Choose how you want to be notified</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-slate-300">Email Notifications</Label>
                    <p className="text-xs text-slate-500">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-600 data-[state=checked]:to-purple-600"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-slate-300">Push Notifications</Label>
                    <p className="text-xs text-slate-500">Receive notifications in your browser</p>
                  </div>
                  <Switch
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-600 data-[state=checked]:to-purple-600"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-slate-300">Channel Updates</Label>
                    <p className="text-xs text-slate-500">Get notified when channels are updated</p>
                  </div>
                  <Switch
                    checked={channelUpdates}
                    onCheckedChange={setChannelUpdates}
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-600 data-[state=checked]:to-purple-600"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-slate-300">Goal Completions</Label>
                    <p className="text-xs text-slate-500">Get notified when goals are completed</p>
                  </div>
                  <Switch
                    checked={goalCompletions}
                    onCheckedChange={setGoalCompletions}
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-600 data-[state=checked]:to-purple-600"
                  />
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
                    "Save Preferences"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="border-slate-800/50 bg-slate-900/50 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">Security Settings</CardTitle>
                <CardDescription className="text-slate-400">Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-slate-300">Two-Factor Authentication</Label>
                    <p className="text-xs text-slate-500">Add an extra layer of security to your account</p>
                  </div>
                  <Switch
                    checked={twoFactorAuth}
                    onCheckedChange={setTwoFactorAuth}
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-600 data-[state=checked]:to-purple-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Password</Label>
                  <div className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-950/50 px-4 py-2">
                    <span className="text-slate-400">••••••••••••</span>
                    <Button
                      variant="ghost"
                      onClick={handleChangePassword}
                      className="text-indigo-400 hover:text-indigo-300 hover:bg-slate-900"
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
                      <div>
                        <p className="text-sm text-slate-300">GitHub</p>
                        {github ? (
                          <p className="text-xs text-slate-500">{github}</p>
                        ) : (
                          <p className="text-xs text-slate-500">Not connected</p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className={
                        github
                          ? "text-red-500 hover:text-red-400 hover:bg-slate-900"
                          : "text-indigo-400 hover:text-indigo-300 hover:bg-slate-900"
                      }
                    >
                      {github ? "Disconnect" : "Connect"}
                    </Button>
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
                    "Save Security Settings"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
