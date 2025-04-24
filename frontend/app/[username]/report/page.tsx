import { headers } from "next/headers"
import { redirect, notFound } from "next/navigation"
import { BarChart2 } from "lucide-react"
import ReportClient from "./report-client"

export default async function ReportPage({ params }: { params: { username: string } }) {
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
        } else
            throw new Error("Server Error " + dashboardRes.status)

    }

    const data = await dashboardRes.json()
    const loggedInUsername = data.username
    const role = data.role
    const product = data.productID

    const param = await params
    if (param.username !== loggedInUsername) {
        redirect(`/${loggedInUsername}`)
    }

    if (role !== "Product Manager") {
        notFound()
    }

    if (!product) {
        return (
            <main className="relative z-10 flex-1 p-6">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                        Reports
                    </h1>
                </div>
                <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                    <div className="max-w-md space-y-6">
                        <BarChart2 className="mx-auto h-12 w-12 text-slate-400" />
                        <h2 className="text-2xl font-bold text-white">No Product Selected</h2>
                        <p className="text-slate-400">
                            You need to select or create a product channel first to see Analytics.
                        </p>
                    </div>
                </div>
            </main>
        )
    }

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
        if (progressRes.status === 400) {
            return (
                <main className="relative z-10 flex-1 p-6">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                            Reports
                        </h1>
                    </div>
                    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                        <div className="max-w-md space-y-6">
                            <BarChart2 className="mx-auto h-12 w-12 text-slate-400" />
                            <h2 className="text-2xl font-bold text-white">No Product Selected</h2>
                            <p className="text-slate-400">
                                You need to select or create a product channel first to see Analytics.
                            </p>
                        </div>
                    </div>
                </main>
            )
        } else
            throw new Error("Server Error " + progressRes.status)
    }
    const progressData = await progressRes.json()
    const progress = progressData.data

    return (
        <main className="relative z-10 flex-1">
            <ReportClient featureData={progress} />
        </main>
    )
}
