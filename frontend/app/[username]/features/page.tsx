import { headers } from "next/headers"
import { redirect, notFound } from "next/navigation"

import FeaturesClient from "./features-client"

export default async function FeaturesPage({ params }: { params: { username: string } }) {
    const headerList = await headers()
    const cookie = headerList.get("cookie") || ""

    const dashboardRes = await fetch(`http://localhost:5000/dashboard`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            Cookie: cookie,
        },
    })

    if (!dashboardRes.ok) {
        if (dashboardRes.status === 401) {
            redirect("/login")
        }
        throw new Error("Server Error " + dashboardRes.status)
    }

    const data = await dashboardRes.json()
    const loggedInUsername = data.username
    const role = data.role

    const param = await params
    if (param.username !== loggedInUsername) {
        redirect(`/${loggedInUsername}`)
    }

    if (role !== "Product Manager" && role !== "Technical Lead") {
        notFound()
    }

    // GET TLs
    const TLRes = await fetch(`http://localhost:5000/productchannel/tl`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            Cookie: cookie,
        },
    })
    if (!TLRes.ok) {
        if (TLRes.status === 401) {
            redirect("/login")
        }
        throw new Error("Server Error " + TLRes.status)
    }
    const TLData = await TLRes.json()
    console.log("Team Leads: ", TLData)

    // GET features
    const featureRes = await fetch(`http://localhost:5000/productchannel/features`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            Cookie: cookie,
        },
    })
    if (!featureRes.ok) {
        if (featureRes.status === 401) {
            redirect("/login")
        }
        throw new Error("Server Error " + featureRes.status)
    }
    const featData = await featureRes.json()
    console.log("Features: ", featData)



    const tlData = TLData.data
    const featureData = featData.data

    return (
        <main className="relative z-10 flex-1 p-5">
            <FeaturesClient initialFeatures={featureData} TechLeads={tlData} />
        </main>
    )
}
