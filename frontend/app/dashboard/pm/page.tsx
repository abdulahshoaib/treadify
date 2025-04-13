"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"
import ChannelCard from "@/components/channel-card"
import { Button } from "@/components/ui/button"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data for demonstration
const initialProductChannels = [
  {
    id: "prod-1",
    name: "Mobile App Redesign",
    type: "product" as const,
    deadline: "Dec 15, 2023",
    progress: 65,
    members: 8,
    href: "/dashboard/pm/channel/prod-1",
  },
]

export default function PMDashboard() {
  const [productChannels, setProductChannels] = useState(initialProductChannels)
  const [newChannelName, setNewChannelName] = useState("")
  const [newChannelDeadline, setNewChannelDeadline] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleCreateChannel = () => {
    const newChannel = {
      id: `prod-${productChannels.length + 1}`,
      name: newChannelName,
      type: "product" as const,
      deadline: newChannelDeadline,
      progress: 0,
      members: 1,
      href: `/dashboard/pm/channel/prod-${productChannels.length + 1}`,
    }

    setProductChannels([...productChannels, newChannel])
    setNewChannelName("")
    setNewChannelDeadline("")
    setIsDialogOpen(false)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader userName="Sarah Johnson" userRole="Product Manager" />
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Product Manager Dashboard</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Product Channel
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Product Channel</DialogTitle>
                <DialogDescription>Add a new product channel to track features and goals.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                    placeholder="Enter product name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={newChannelDeadline}
                    onChange={(e) => setNewChannelDeadline(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateChannel}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mt-6">
          <Tabs defaultValue="active">
            <TabsList>
              <TabsTrigger value="active">Active Channels</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="mt-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {productChannels.map((channel) => (
                  <ChannelCard key={channel.id} {...channel} />
                ))}
                {productChannels.length === 0 && (
                  <div className="col-span-full flex h-40 items-center justify-center rounded-lg border border-dashed">
                    <div className="flex flex-col items-center gap-1 text-center">
                      <p className="text-sm text-muted-foreground">No active product channels</p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="link" className="h-auto p-0 text-sm">
                            Create your first product channel
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Create New Product Channel</DialogTitle>
                            <DialogDescription>
                              Add a new product channel to track features and goals.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="name">Product Name</Label>
                              <Input
                                id="name"
                                value={newChannelName}
                                onChange={(e) => setNewChannelName(e.target.value)}
                                placeholder="Enter product name"
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="deadline">Deadline</Label>
                              <Input
                                id="deadline"
                                type="date"
                                value={newChannelDeadline}
                                onChange={(e) => setNewChannelDeadline(e.target.value)}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleCreateChannel}>Create</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="completed" className="mt-6">
              <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
                <p className="text-sm text-muted-foreground">No completed product channels</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
