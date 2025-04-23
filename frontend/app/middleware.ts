import { NextRequest, NextResponse } from 'next/server'

const ROLE_PATHS = {
    "Product Manager": ["/features", "/reports", "/profile"],
    "Technical Lead": ["/goals", "/reviews", "/reports", "/profile"],
    "Developer": ["/goals", "/commits", "/profile"],
}

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl
    const cookie = req.headers.get("cookie") || ""
    console.log(cookie)

    if (!pathname.startsWith("/_next") && pathname !== "/login") {
        const match = pathname.match(/^\/([^\/]+)(\/[^\/]*)?/)
        const usernameInPath = match?.[1]
        const subPath = match?.[2] || "/"

        const authRes = await fetch("http://localhost:5000/dashboard", {
            method: "GET",
            headers: {
                Cookie: cookie,
                Accept: "application/json"
            }
        })

        if (!authRes.ok) {
            return NextResponse.redirect(new URL("/login", req.url))
        }

        const userData = await authRes.json()
        const loggedInUsername = userData.username
        const role = userData.role

        if (usernameInPath !== loggedInUsername) {
            return NextResponse.redirect(new URL(`/${loggedInUsername}`, req.url))
        }

        const allowedPaths = ROLE_PATHS[role] || []
        const isAllowed = allowedPaths.some(path => subPath.startsWith(path))

        if (!isAllowed && subPath !== "/") {
            return NextResponse.redirect(new URL(`/${loggedInUsername}`, req.url))
        }
    }

    return NextResponse.next()
}
