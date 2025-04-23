import { headers } from "next/headers"
import { redirect, notFound } from "next/navigation"

import GoalsClient from "./goals-client"

export default async function GoalsPage({ params }: { params: { username: string } }) {
    const headerList = await headers()
    const cookie = headerList.get("cookie") || ""

    const goalsRes = await fetch(`http://localhost:5000/featurechannel/goals`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            Cookie: cookie
        }
    })

    const goal = await goalsRes.json()
    console.log(goal)

    if (!goalsRes.ok) {
        if (goalsRes.status === 401) {
            redirect("/login")
        }
        throw new Error("Server Error " + goalsRes.status)
    }

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
    console.log(loggedInUsername)
    if (param.username !== loggedInUsername) {
        redirect(`/${loggedInUsername}`)
    }

    if (role !== "Developer" && role !== "Technical Lead") {
        notFound()
    }

    return (
        <main className="relative z-10 flex-1 p-6">
            <GoalsClient goalData={goal.data} />
        </main>
    )
}
