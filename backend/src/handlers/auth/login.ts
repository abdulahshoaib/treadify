import type { Response, Request } from "express"
import bcrypt from "bcrypt"

import { query } from "../../database/query.ts"

export const login = async (req: Request, res: Response) => {
    try {
        const { username, pass } = req.body

        if (!username || !pass) {
            console.log("Invalid Input")
            return res.status(400).json({ error: "Invalid Input" })
        }

        const authLogin = `
            SELECT u.UserID, u.Username, u.Email, u.Pass, cm.ProductID, cm.FeatureID, r.Name
            FROM Users u
            LEFT JOIN ChannelMembers cm ON u.UserID = cm.UserID
            LEFT JOIN UserRoles ur ON u.UserID = ur.UserID
            LEFT JOIN Roles r ON ur.RoleID = r.RoleID
            WHERE u.Username = @username
        `


        const user = await query(authLogin, { username })

        const channelID = await query(`
        SELECT c.ChannelID
        FROM Channels c
        INNER JOIN ChannelMembers cm ON
            (c.ProductID = cm.ProductID AND
            (c.FeatureID = cm.FeatureID OR (c.FeatureID IS NULL AND cm.FeatureID IS NULL)))
        WHERE cm.UserID = @UserID`,
            { UserID: user[0].UserID }
        )

        const ChannelID = channelID[0]?.ChannelID

        if (user.length == 0) {
            console.log("No user found")
            return res.status(401).json({ error: "No User Found" })
        }

        const validPassword = await bcrypt.compare(pass, user[0].Pass)
        if (!validPassword) {
            console.log("Invalid Password")
            return res.status(401).json({ error: "Invalid Password" })
        }

        // check for session middleware working
        if (!req.session) {
            console.log("Session Error")
            return res.status(500).json({ error: "Session Error" });
        }

        // create a session
        req.session.User = {
            id: user[0].UserID,
            username: user[0].Username,
            email: user[0].Email,
            product: user[0].ProductID,
            feature: user[0].FeatureID,
            channel: ChannelID,
            role: user[0].Name
        }

        return res.status(200).json({
            message: "Login successful",
            redirect: `http://localhost:3000/${username}`
        })
    } catch (err: any) {
        console.log(err.message)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}
