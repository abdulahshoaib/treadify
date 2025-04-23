import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    try {
        const backendRes = await fetch("http://localhost:5000/auth/session", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: req.cookies.toString(),
            },
        })

        const data = await backendRes.json()

        if (!backendRes.ok) {
            return NextResponse.json({ loggedIn: false }, { status: 401 })
        }

        return NextResponse.json({ loggedIn: true, user: data.user }, { status: 200 })
    } catch (err) {
        console.error("Session check failed:", err)
        return NextResponse.json({ loggedIn: false }, { status: 500 })
    }
}
