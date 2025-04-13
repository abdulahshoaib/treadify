"use client"

import { useState } from "react"
import DashboardHeader from "@/components/dashboard-header"
import ChannelCard from "@/components/channel-card"
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
    href: "/dashboard/tl/product/prod-1",
  },
]

const initialFeatureChannels = [
  {
    id: "feat-1",
    name: "User Authentication",
    type: "feature" as const,
    deadline: "Nov 20, 2023",
    progress: 80,
    members: 3,
    href: "/dashboard/tl/feature/feat-1",
  },
]

export default function TLDashboard() {
  const [productChannels] = useState(initialProductChannels)
  const [featureChannels] = useState(initialFeatureChannels)

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader userName="Michael Chen" userRole="Technical Lead" />
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Technical Lead Dashboard</h1>
        </div>

        <div className="mt-6">
          <Tabs defaultValue="product">
            <TabsList>
              <TabsTrigger value="product">Product Channels</TabsTrigger>
              <TabsTrigger value="feature">Feature Channels</TabsTrigger>
            </TabsList>
            <TabsContent value="product" className="mt-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {productChannels.map((channel) => (
                  <ChannelCard key={channel.id} {...channel} />
                ))}
                {productChannels.length === 0 && (
                  <div className="col-span-full flex h-40 items-center justify-center rounded-lg border border-dashed">
                    <p className="text-sm text-muted-foreground">No product channels assigned</p>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="feature" className="mt-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featureChannels.map((channel) => (
                  <ChannelCard key={channel.id} {...channel} />
                ))}
                {featureChannels.length === 0 && (
                  <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
                    <p className="text-sm text-muted-foreground">No feature channels assigned</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
