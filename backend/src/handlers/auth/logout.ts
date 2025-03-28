import type { Response, Request } from "express"

export const logout = (req: Request, res: Response) => {
    try {
        if (!req.session)
            res.status(400).json({ error: "No active session" })

        req.session.destroy((err) => {
            if (err) {
                console.error("Session destruction error:", err)
                res.status(500).json({ error: "Could not log out" })
            }

            // Clear the session cookie
            res.clearCookie("connect.sid", {
                path: "/",
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict"
            })

            res.status(200).json({ message: "Logout successful" })
        })
    } catch (err: any) {
        console.error("Logout error:", err)
        res.status(500).json({ error: "Internal server error" })
    }
}
