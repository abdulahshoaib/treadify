import { notFound } from "next/navigation"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import DevDashboard from "@/components/DevDashboard"
import TLDashboard from "@/components/TLDashboard"
import PMDashboard from "@/components/PMDashboard"

type Repo = {
    name: string
}

export default async function DashboardPage() {
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

    if (!dashboardRes.ok) {
        if (dashboardRes.status === 401) {
            redirect("/login")
        }
        throw new Error("Server Error " + dashboardRes.status) as any
    }
    console.log("dashboardRes: " + dashboardRes.status)

    const data = await dashboardRes.json()
    if (!dashboardRes.ok) console.log("data: " + data.error)

    let repos: Repo[] = []
    if (data.role === "Product Manager") {
        // fetch the userRepos
        const repoRes = await fetch(`http://localhost:5000/user/repos`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Cookie: cookie
            },
        })
        if (!repoRes.ok) {
            if (repoRes.status === 401) {
                redirect("/login")
            }
            throw new Error("Server Error " + repoRes.status) as any
        }

        const repoData = await repoRes.json()
        repos = repoData.data?.repositories || []

        if (!repoRes.ok) console.log("data: " + repoData.error)
        else console.log("repoData: " + repoData.data)
    }


    switch (data.role) {
        case "Developer":
            return <DevDashboard />
        case "Technical Lead":
            return <TLDashboard />
        case "Product Manager":
            return <PMDashboard repos={repos} />
        default:
            notFound()
    }
}
