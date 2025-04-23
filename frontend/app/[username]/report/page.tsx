import { headers } from "next/headers"
import { redirect, notFound } from "next/navigation"
import ReportClient from "./report-client"

export default async function ReportPage({ params }: { params: { username: string } }) {
    const headerList = await headers()
    const cookie = headerList.get("cookie") || ""

    const progressRes = await fetch(`http://localhost:5000/progress/productchannel`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            Cookie: cookie,
        },
    })
    if (!progressRes.ok) {
        if (progressRes.status === 401)
            redirect("/login")
        throw new Error("Server Error " + progressRes.status)
    }
    const progressData = await progressRes.json()
    const progress = progressData.data

    console.log(progress)

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

    if (role !== "Product Manager") {
        notFound()
    }

    return (
        <main className="relative z-10 flex-1">
            <ReportClient featureData={progress} />
        </main>
    )
}
