import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    const cookie = req.headers.get("cookie") || ""
    const data = await req.json()

    const res = await fetch("http://localhost:5000/productchannel/features", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Cookie: cookie,
        },
        body: JSON.stringify(data),
    })

    const result = await res.json()

    if (!res.ok)
        throw new Error("" + res.status + ": " + result.error)

    return NextResponse.json(result)
}
