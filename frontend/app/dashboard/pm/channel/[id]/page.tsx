"use client"

import { useState } from "react"
import { CalendarClock, Plus, Users } from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample data for demonstration
const initialFeatureChannels = [
  {
    id: "feat-1",
    name: "User Authentication",
    description: "Implement secure login and registration system",
    deadline: "Nov 20, 2023",
    progress: 80,
    techLead: "Michael Chen",
  },
  {
    id: "feat-2",
    name: "Profile Management",
    description: "Allow users to update their profile information and preferences",
    deadline: "Nov 30, 2023",
    progress: 45,
    techLead: "Emily Rodriguez",
  },
  {
    id: "feat-3",
    name: "Notification System",
    description: "Implement real-time notifications for user actions",
    deadline: "Dec 10, 2023",
    progress: 20,
    techLead: "David Kim",
  },
]

// Sample tech leads for assignment
const techLeads = [
  { id: "tl-1", name: "Michael Chen" },
  { id: "tl-2", name: "Emily Rodriguez" },
  { id: "tl-3", name: "David Kim" },
  { id: "tl-4", name: "Sarah Williams" },
]

export default function ProductChannelPage({ params }: { params: { id: string } }) {
  const [featureChannels, setFeatureChannels] = useState(initialFeatureChannels)
  const [newFeatureName, setNewFeatureName] = useState("")
  const [newFeatureDescription, setNewFeatureDescription] = useState("")
  const [newFeatureDeadline, setNewFeatureDeadline] = useState("")
  const [selectedTechLead, setSelectedTechLead] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleCreateFeature = () => {
    const selectedLead = techLeads.find((tl) => tl.id === selectedTechLead)

    const newFeature = {
      id: `feat-${featureChannels.length + 1}`,
      name: newFeatureName,
      description: newFeatureDescription,
      deadline: newFeatureDeadline,
      progress: 0,
      techLead: selectedLead ? selectedLead.name : "Unassigned",
    }

    setFeatureChannels([...featureChannels, newFeature])
    setNewFeatureName("")
    setNewFeatureDescription("")
    setNewFeatureDeadline("")
    setSelectedTechLead("")
    setIsDialogOpen(false)
  }

  // Calculate overall progress
  const overallProgress =
    featureChannels.length > 0
      ? Math.round(featureChannels.reduce((sum, feature) => sum + feature.progress, 0) / featureChannels.length)
      : 0

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
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
              Mobile App Redesign
            </h1>
            <Button
              variant="outline"
              className="border-slate-800 bg-slate-900/30 text-white hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-blue-950 backdrop-blur-sm"
            >
              Generate Join Code
            </Button>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <Card className="border-slate-800/30 bg-slate-900/30 backdrop-blur-md shadow-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white">Overall Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Progress</span>
                    <span className="font-medium text-white">{overallProgress}%</span>
                  </div>
                  <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-800/80 p-0.5">
                    <div
                      className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_5px_rgba(0,255,255,0.5)]"
                      style={{ width: `${overallProgress}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-800/30 bg-slate-900/30 backdrop-blur-md shadow-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white">Deadline</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center space-x-3">
                <div className="bg-slate-800/80 p-2.5 rounded-md">
                  <CalendarClock className="h-5 w-5 text-cyan-400" />
                </div>
                <span className="text-slate-300">December 15, 2023</span>
              </CardContent>
            </Card>
            <Card className="border-slate-800/30 bg-slate-900/30 backdrop-blur-md shadow-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white">Team Members</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center space-x-3">
                <div className="bg-slate-800/80 p-2.5 rounded-md">
                  <Users className="h-5 w-5 text-purple-400" />
                </div>
                <span className="text-slate-300">8 members</span>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Feature Channels</h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 shadow-lg shadow-blue-900/20">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Feature
                </Button>
              </DialogTrigger>
              <DialogContent className="border-slate-800/50 bg-black/90 backdrop-blur-xl text-white shadow-xl shadow-purple-900/10">
                <DialogHeader>
                  <DialogTitle className="text-xl text-white">Create New Feature Channel</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Add a new feature channel and assign a technical lead.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="feature-name" className="text-slate-300">
                      Feature Name
                    </Label>
                    <Input
                      id="feature-name"
                      value={newFeatureName}
                      onChange={(e) => setNewFeatureName(e.target.value)}
                      placeholder="Enter feature name"
                      className="border-slate-800/50 bg-slate-900/50 text-white focus:border-cyan-500 focus:ring-cyan-500"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="feature-description" className="text-slate-300">
                      Description
                    </Label>
                    <Textarea
                      id="feature-description"
                      value={newFeatureDescription}
                      onChange={(e) => setNewFeatureDescription(e.target.value)}
                      placeholder="Describe the feature"
                      className="border-slate-800/50 bg-slate-900/50 text-white focus:border-cyan-500 focus:ring-cyan-500"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="feature-deadline" className="text-slate-300">
                      Deadline
                    </Label>
                    <Input
                      id="feature-deadline"
                      type="date"
                      value={newFeatureDeadline}
                      onChange={(e) => setNewFeatureDeadline(e.target.value)}
                      className="border-slate-800/50 bg-slate-900/50 text-white focus:border-cyan-500 focus:ring-cyan-500"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tech-lead" className="text-slate-300">
                      Technical Lead
                    </Label>
                    <Select value={selectedTechLead} onValueChange={setSelectedTechLead}>
                      <SelectTrigger className="border-slate-800/50 bg-slate-900/50 text-white focus:border-cyan-500 focus:ring-cyan-500">
                        <SelectValue placeholder="Select a technical lead" />
                      </SelectTrigger>
                      <SelectContent className="border-slate-800 bg-black/90 backdrop-blur-xl text-white">
                        {techLeads.map((tl) => (
                          <SelectItem key={tl.id} value={tl.id} className="focus:bg-slate-800 focus:text-cyan-400">
                            {tl.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    onClick={handleCreateFeature}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0"
                  >
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featureChannels.map((feature) => (
              <Card
                key={feature.id}
                className="border-slate-800/30 bg-slate-900/30 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-slate-700/50 group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-slate-900/0 to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader>
                  <CardTitle className="text-white">{feature.name}</CardTitle>
                  <CardDescription className="text-slate-400">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className="bg-slate-800/80 p-1.5 rounded-md mr-2">
                        <CalendarClock className="h-4 w-4 text-cyan-400" />
                      </div>
                      <span className="text-slate-400">Deadline: {feature.deadline}</span>
                    </div>
                    <span className="font-medium text-slate-300">Lead: {feature.techLead}</span>
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
                  <Button
                    variant="outline"
                    className="w-full border-slate-800 bg-slate-900/30 text-white hover:bg-blue-950 hover:text-cyan-400 hover:border-cyan-500/50 backdrop-blur-sm"
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
