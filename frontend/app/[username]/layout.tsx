"use client"

import { useParams } from "next/navigation"
import { ReactNode, useEffect, useState } from "react"
import DashboardHeader from "@/components/dashboard-header"

export default function UsernameLayout({ children }: { children: ReactNode }) {
    const params = useParams()
    const username = params.username as string

    const [name, setName] = useState("")
    const [role, setRole] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`http://localhost:5000/user/profile`, {
                    method: "GET",
                    credentials: "include",
                })
                const data = await res.json()
                setName(data.name)
                setRole(data.role)
            } catch (error) {
                console.error("Failed to fetch user data", error)
            }
        }

        if (username) fetchData()
    }, [username])

    if (!username) {
        throw new Error("Username is undefined")
    }

    return (
        <>
            <DashboardHeader userName={name} userRole={role} username={username} />

            {/* Background gradient effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[#030711]"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-950/20 via-transparent to-purple-950/20"></div>
                <div className="absolute top-[15%] left-[10%] w-[30rem] h-[30rem] rounded-full bg-blue-900/5 blur-3xl"></div>
                <div className="absolute bottom-[10%] right-[5%] w-[25rem] h-[25rem] rounded-full bg-cyan-900/5 blur-3xl"></div>
                <div className="absolute top-[40%] right-[30%] w-[20rem] h-[20rem] rounded-full bg-purple-900/5 blur-3xl"></div>
            </div>

            <main className="relative z-10 flex-1">
                {children}
            </main>
        </>
    )
}

