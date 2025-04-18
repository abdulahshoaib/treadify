import { notFound, redirect } from "next/navigation"

import DevDashboard from "@/components/DevDashboard"
import TLDashboard from "@/components/TLDashboard"
import PMDashboard from "@/components/PMDashboard"

export default async function DashboardPage({ params }: { params: { username: string } }) {
    const { username } = params

    const role = await fetch(`http://localhost:5000/dashboard/${username}`, {
        method: "GET",
        headers: { application: "json" },
        credentials: "include",
        cache: "no-store",
    })

    if (role.status === 401)
        redirect("/login")

    const data = await role.json()

    if (!data)
        notFound()

    console.log(data.role)
    switch (data.role) {
        case "Developer":
            return <DevDashboard Role={data.role} Name={data.name} />
        case "Technical Lead":
            return <TLDashboard Role={data.role} Name={data.name} />
        case "Product Manager":
            return <PMDashboard Role={data.role} Name={data.name} />
        default:
            notFound()
    }
}
