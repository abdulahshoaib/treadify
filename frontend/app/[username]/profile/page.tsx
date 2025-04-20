import { headers } from "next/headers"
import { redirect } from "next/navigation"
import ProfileClient from "@/components/profile-client"

export default async function ProfilePage() {
    const headerList = await headers()
    const cookie = headerList.get("cookie") || ""

    const res = await fetch(`http://localhost:5000/user/profile`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            Cookie: cookie
        },
    })

    if (!res.ok) {
        if (res.status === 401) {
            redirect("/login")
        }
        throw new Error("Server Error") as any
    }

    const data = await res.json()

    console.log(data)

    console.log("name: " + data.name)
    console.log("email: " + data.email)
    console.log("role: " + data.role)
    console.log("GHusername: " + data.ghusername)

    return <ProfileClient initialData={data}/>
}
