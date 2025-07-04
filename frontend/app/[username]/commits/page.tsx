import { headers } from "next/headers"
import { redirect, notFound } from "next/navigation"

import CommitsClient from "./commits-client"

export default async function CommitsPage({ params }: { params: { username: string } }) {
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

    if (role !== "Developer") {
        notFound()
    }

    return (
        <main className="relative z-10 flex-1 p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                    Commits
                </h1>
            </div>
            <CommitsClient />
        </main>
    )
}
