import { notFound } from "next/navigation"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import DevDashboard from "@/components/DevDashboard"
import TLDashboard from "@/components/TLDashboard"
import PMDashboard from "@/components/PMDashboard"

type Repo = {
    name: string
}

export default async function DashboardPage({ params }: { params: { username: string } }) {
    const headerList = await headers()
    const cookie = headerList.get("cookie") || ""

    // get userRole to render the dashboard
    const dashboardRes = await fetch(`http://localhost:5000/dashboard`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            Cookie: cookie
        },
    })

    const data = await dashboardRes.json()
    const loggedInUser = data.username
    const productID = data.productID

    if (!dashboardRes.ok) {
        throw new Error(" " + data.username + data.error) as any
    }

    const param = await params
    if (param.username !== loggedInUser)
        notFound()

    if (!dashboardRes.ok) console.log("data: " + data.error)

    switch (data.role) {
        case "Developer":
            return <DevDashboard />
        case "Technical Lead":
            return <TLDashboard />
        case "Product Manager":
            console.log("productID: "+productID)
            let repoData = null
            if (!productID) {
                const repoRes = await fetch("http://localhost:5000/user/repos", {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        Cookie: cookie,
                    },
                })

                if (!repoRes.ok) {
                    if (repoRes.status === 401) redirect("/login")
                    throw new Error(`Failed to fetch repos: ${repoRes.status}`)
                }
                repoData = await repoRes.json()
            }
            const repos = repoData?.data.repositories || []

            let productChannelData = null
            if (productID) {
                const pcRes = await fetch("http://localhost:5000/productchannel/", {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        Cookie: cookie,
                    },
                })

                if (pcRes.ok) {
                    productChannelData = await pcRes.json()
                } else {
                    console.error(`Failed to fetch product channel: ${pcRes.status}`)
                    productChannelData = null
                }
            }

            return <PMDashboard repos={repos} data={productChannelData} />
        default:
            notFound()
    }
}
