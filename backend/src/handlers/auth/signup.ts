import type { Request, Response } from "express"
import bcrypt from "bcrypt"

import { query } from "../../database/query.ts"

export const checkUsername = async (req: Request, res: Response) => {
    try {
        const { username } = req.params

        if (!username)
            return res.status(400).json({ error: "Invalid Input" })

        const existingUser = await query(`
              SELECT * FROM Users WHERE Username = @username
       `, { username })

        if (existingUser.length > 0)
            return res.status(200).json({ available: false })

        return res.status(200).json({ available: true })

    } catch (err: any) {
        console.error(err.message)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

export const signup = async (req: Request, res: Response) => {
    try {
        const { FirstName, LastName, role, username, email, pass } = req.body
        console.log("Signup data", req.body)

        if (!FirstName || !LastName || !role || !username || !email || !pass)
            return res.status(400).json({ error: "Invalid Input" })

        // hash the password
        const hash = await bcrypt.hash(pass, 10)

        const getRoleRedir = () => {
            if (role === "productmanager") return "Product Manager";
            if (role === "developer") return "Developer";
            if (role === "technicallead") return "Technical Lead";
        }

        await query(
            `INSERT INTO Users (FirstName, LastName, Username, Email, Pass)
             VALUES (@FirstName, @LastName, @username, @email, @hash)`,
            { FirstName, LastName, username, email, hash }
        )

        const roleRes = await query(
            `SELECT RoleID FROM Roles WHERE Name = @role`,
            { role: getRoleRedir() }
        )

        if (roleRes?.length === 0)
            return res.status(400).json({ error: "Invalid role" });

        const RoleID = roleRes[0]?.RoleID;

        const userResult = await query(
            `SELECT u.UserID, u.Username, u.Email
            FROM Users u
            WHERE u.Username = @username
            `,
            { username }
        )

        if (userResult.length === 0)
            return res.status(401).json({ error: "No User Found" })


        const user = userResult[0]
        const userID = user.UserID

        await query(
            `INSERT INTO UserRoles (UserID, RoleID) VALUES (@UserID, @RoleID)`,
            { UserID: userID, RoleID }
        )

        if (!req.session)
            return res.status(500).json({ error: "Session Error" });

        req.session.User = {
            id: user.UserID,
            username: user.Username,
            email: user.Email,
            role: role,
            product: null,
            feature: null
        }

        return res.status(200).json({ message: "Signup and logged in" })


    } catch (err: any) {
        console.error(err.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}
