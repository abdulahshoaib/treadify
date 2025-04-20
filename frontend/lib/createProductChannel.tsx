export async function createProductChannel(
    Name: string,
    RepoName: string,
    Deadline: string
) {
    const res = await fetch("/api/create-product", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ Name, RepoName, Deadline }),
    })

    const data = await res.json()
    console.log("DATA: " + data)

    if (!res.ok) {
        if (res.status === 401) {
            window.location.href = "/login"
        }
        throw new Error(data?.error || "Server Error")
    }

    return data
}
