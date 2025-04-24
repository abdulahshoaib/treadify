import type { Request, Response } from "express"
import { query } from "../../database/query.ts"

export const getDashboard = async (req: Request, res: Response) => {
    if (!req.session.User)
        return res.status(401).json({ error: "Unauthorized" })

    try {
        const username = req.session.User?.username

        const userRes = await query(
            `SELECT u.*, ug.GitHubUsername, r.Name
            FROM Users u
            LEFT JOIN UserRoles ur ON u.UserID = ur.UserID
            LEFT JOIN Roles r ON ur.RoleID = r.RoleID
            LEFT JOIN UserGitHubIntegration ug ON u.UserID = ug.UserID
            WHERE u.Username = @username`,
            { username }
        )

        if (userRes.length === 0) {
            return res.status(401).json({ error: "No User Found" })
        }

        return res.status(200).json({
            success: true,
            role: userRes[0].Name,
            username: userRes[0].Username,
            productID: req.session.User?.product,
            featureID: req.session.User?.feature
        });

    } catch (err: any) {
        console.error(err.message)
        return res.status(500).json({ err: err.message })
    }
}
