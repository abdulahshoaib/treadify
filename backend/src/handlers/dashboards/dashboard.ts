import type { Request, Response } from "express"
import { query } from "../../database/query.ts"

export const dashboard = async (req: Request, res: Response) => {
    if (!req.session){
        console.log("Unauthorized")
        return res.status(401).json({ error: "Unauthorized" })
    }

    try {
        const username = req.session.User?.username

        const userRes = await query(
            `SELECT u.*            FROM Users u

            WHERE u.Username = @username`,
            { username }
        )

        if (userRes.length === 0){
            console.log("No user found")
            return res.status(401).json({ error: "No User Found" })
        }

        return res.status(200).json({ role: userRes[0].Name, name: userRes[0].FirstName + " " + userRes[0].LastName })

    } catch (err: any) {
        console.error(err.message)
        return res.status(500).json({ err: err.message })
    }
}
