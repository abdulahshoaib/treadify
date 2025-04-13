"use client"

import { useState } from "react"
import { CalendarClock, Plus, Users } from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
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
        <div className="flex min-h-screen flex-col">
            <DashboardHeader userName="Sarah Johnson" userRole="Product Manager" />
            <main className="flex-1 p-6">
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Mobile App Redesign</h1>
                        <Button variant="outline">Generate Join Code</Button>
                    </div>

                    <div className="mt-6 grid gap-6 md:grid-cols-3">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span>Progress</span>
                                        <span className="font-medium">{overallProgress}%</span>
                                    </div>
                                    <Progress value={overallProgress} className="h-2" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Deadline</CardTitle>
                            </CardHeader>
                            <CardContent className="flex items-center space-x-2">
                                <CalendarClock className="h-5 w-5 text-muted-foreground" />
                                <span>December 15, 2023</span>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                            </CardHeader>
                            <CardContent className="flex items-center space-x-2">
                                <Users className="h-5 w-5 text-muted-foreground" />
                                <span>8 members</span>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Feature Channels</h2>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Feature
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create New Feature Channel</DialogTitle>
                                    <DialogDescription>Add a new feature channel and assign a technical lead.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="feature-name">Feature Name</Label>
                                        <Input
                                            id="feature-name"
                                            value={newFeatureName}
                                            onChange={(e) => setNewFeatureName(e.target.value)}
                                            placeholder="Enter feature name"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="feature-description">Description</Label>
                                        <Textarea
                                            id="feature-description"
                                            value={newFeatureDescription}
                                            onChange={(e) => setNewFeatureDescription(e.target.value)}
                                            placeholder="Describe the feature"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="feature-deadline">Deadline</Label>
                                        <Input
                                            id="feature-deadline"
                                            type="date"
                                            value={newFeatureDeadline}
                                            onChange={(e) => setNewFeatureDeadline(e.target.value)}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="tech-lead">Technical Lead</Label>
                                        <Select value={selectedTechLead} onValueChange={setSelectedTechLead}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a technical lead" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {techLeads.map((tl) => (
                                                    <SelectItem key={tl.id} value={tl.id}>
                                                        {tl.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleCreateFeature}>Create</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {featureChannels.map((feature) => (
                            <Card key={feature.id}>
                                <CardHeader>
                                    <CardTitle>{feature.name}</CardTitle>
                                    <CardDescription>{feature.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Deadline: {feature.deadline}</span>
                                        <span className="font-medium">Tech Lead: {feature.techLead}</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span>Progress</span>
                                            <span>{feature.progress}%</span>
                                        </div>
                                        <Progress value={feature.progress} className="h-2" />
                                    </div>
                                    <Button variant="outline" className="w-full">
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
