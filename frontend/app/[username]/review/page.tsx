import { headers } from "next/headers"
import { redirect, notFound } from "next/navigation"
import { ClipboardList } from "lucide-react"
import ReviewClient from "./review-client"

export default async function ReviewsPage({ params }: { params: { username: string } }) {
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
    const product = data.productID

    if (!product) {
        return (
            <main className="relative z-10 flex-1 p-6">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                        Reviews
                    </h1>
                </div>
                <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                    <div className="max-w-md space-y-6">
                        <ClipboardList className="mx-auto h-12 w-12 text-slate-400" />
                        <h2 className="text-2xl font-bold text-white">No Product Selected</h2>
                        <p className="text-slate-400">
                            You need to Join a product channel first to Start Review
                        </p>
                    </div>
                </div>
            </main>
        )
    }

    const param = await params
    if (param.username !== loggedInUsername) {
        redirect(`/${loggedInUsername}`)
    }

    if (role !== "Technical Lead") {
        notFound()
    }

    const commitRes = await fetch("http://localhost:5000/featurechannel/commit", {
        method: "GET",
        headers: {
            Accept: "application/json",
            Cookie: cookie,
        },

    })

    const  commitData = await commitRes.json()
    if (!commitRes.ok) {
        if (commitRes.status === 401) {
            redirect('/login')
        }
        throw new Error(commitData.error)
    }


    return (
        <main className="relative z-10 flex-1 p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                    Reviews
                </h1>
            </div>
            <ReviewClient initialSubmission={commitData} />
        </main>
    )
}

