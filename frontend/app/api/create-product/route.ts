import { headers } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    console.log("API route hit: create-product");
    try {
        const body = await req.json();
        console.log("Request body:", body);
        const { Name, RepoName, Deadline } = body;

        const header = await headers();
        const cookie = header.get("cookie") || "";


        console.log("\n\n", Name, RepoName, Deadline)
        const res = await fetch("http://localhost:5000/productchannel", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Cookie: cookie,
            },
            body: JSON.stringify({ Name, RepoName, Deadline }),
        });

        console.log("Backend response status:", res.status);
        const data = await res.json();
        console.log("Backend response data:", data);

        if (!res.ok) {
            console.error("Error from backend:", data);
            return NextResponse.json({ error: data }, { status: res.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error in API route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
