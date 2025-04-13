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
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
                        Product Manager Dashboard
                    </h1>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 shadow-lg shadow-blue-900/20">
                                <Plus className="mr-2 h-4 w-4" />
                                New Product Channel
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="border-slate-800/50 bg-black/90 backdrop-blur-xl text-white shadow-xl shadow-purple-900/10">
                            <DialogHeader>
                                <DialogTitle className="text-xl text-white">Create New Product Channel</DialogTitle>
                                <DialogDescription className="text-slate-400">
                                    Add a new product channel to track features and goals.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name" className="text-slate-300">
                                        Product Name
                                    </Label>
                                    <Input
                                        id="name"
                                        value={newChannelName}
                                        onChange={(e) => setNewChannelName(e.target.value)}
                                        placeholder="Enter product name"
                                        className="border-slate-800/50 bg-slate-900/50 text-white focus:border-cyan-500 focus:ring-cyan-500"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="deadline" className="text-slate-300">
                                        Deadline
                                    </Label>
                                    <Input
                                        id="deadline"
                                        type="date"
                                        value={newChannelDeadline}
                                        onChange={(e) => setNewChannelDeadline(e.target.value)}
                                        className="border-slate-800/50 bg-slate-900/50 text-white focus:border-cyan-500 focus:ring-cyan-500"
                                    />
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
                                    onClick={handleCreateChannel}
                                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0"
                                >
                                    Create
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="mt-8">
                    <Tabs defaultValue="active">
                        <TabsList className="bg-slate-900/30 backdrop-blur-sm border border-slate-800/50 p-1 h-12">
                            <TabsTrigger
                                value="active"
                                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-900/20 h-10"
                            >
                                Active Channels
                            </TabsTrigger>
                            <TabsTrigger
                                value="completed"
                                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-900/20 h-10"
                            >
                                Completed
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="active" className="mt-8">
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {productChannels.map((channel) => (
                                    <ChannelCard key={channel.id} {...channel} />
                                ))}
                                {productChannels.length === 0 && (
                                    <div className="col-span-full flex h-40 items-center justify-center rounded-lg border border-dashed border-slate-800/50 bg-slate-900/20 backdrop-blur-sm">
                                        <div className="flex flex-col items-center gap-1 text-center">
                                            <p className="text-sm text-slate-400">No active product channels</p>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="link" className="h-auto p-0 text-sm text-cyan-400 hover:text-cyan-300">
                                                        Create your first product channel
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="border-slate-800/50 bg-black/90 backdrop-blur-xl text-white shadow-xl shadow-purple-900/10">
                                                    <DialogHeader>
                                                        <DialogTitle className="text-xl text-white">Create New Product Channel</DialogTitle>
                                                        <DialogDescription className="text-slate-400">
                                                            Add a new product channel to track features and goals.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="grid gap-4 py-4">
                                                        <div className="grid gap-2">
                                                            <Label htmlFor="name" className="text-slate-300">
                                                                Product Name
                                                            </Label>
                                                            <Input
                                                                id="name"
                                                                value={newChannelName}
                                                                onChange={(e) => setNewChannelName(e.target.value)}
                                                                placeholder="Enter product name"
                                                                className="border-slate-800/50 bg-slate-900/50 text-white focus:border-cyan-500 focus:ring-cyan-500"
                                                            />
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <Label htmlFor="deadline" className="text-slate-300">
                                                                Deadline
                                                            </Label>
                                                            <Input
                                                                id="deadline"
                                                                type="date"
                                                                value={newChannelDeadline}
                                                                onChange={(e) => setNewChannelDeadline(e.target.value)}
                                                                className="border-slate-800/50 bg-slate-900/50 text-white focus:border-cyan-500 focus:ring-cyan-500"
                                                            />
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
                                                            onClick={handleCreateChannel}
                                                            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0"
                                                        >
                                                            Create
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                        <TabsContent value="completed" className="mt-8">
                            <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-slate-800/50 bg-slate-900/20 backdrop-blur-sm">
                                <p className="text-sm text-slate-400">No completed product channels</p>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    )
}
