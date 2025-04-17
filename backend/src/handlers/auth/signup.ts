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

        if (existingUser.length > 0){
            console.log("Username exists");
            return res.status(200).json({ available: false })
        }

        console.log("Username is available");
        return res.status(200).json({ available: true })

    } catch (err: any) {
        console.error(err.message)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

export const signup = async (req: Request, res: Response) => {
    try {
        const { FirstName, LastName, role, username, email, pass } = req.body

        if (!FirstName || !LastName || !role || !username || !email || !pass)
            res.status(400).json({ error: "Invalid Input" })

        // hash the password
        const hash = await bcrypt.hash(pass, 10)

        await query(
            `INSERT INTO Users (FirstName, LastName, Username, Email, Pass)
             VALUES (@FirstName, @LastName, @username, @email, @hash)`,
            { FirstName, LastName, username, email, hash }
        )

        const userResult = await query(
            `SELECT UserID FROM Users WHERE Username = @username`,
            { username }
        )

        const UserID = userResult[0]?.UserID;

        const roleRes = await query(
            `SELECT RoleID FROM Roles WHERE Name = @role`,
            { role }
        )

        if (roleRes?.length === 0)
            res.status(400).json({ error: "Invalid role" });

        const RoleID = roleRes[0]?.RoleID;

        await query(
            `INSERT INTO UserRoles (UserID, RoleID) VALUES (@UserID, @RoleID)`,
            { UserID, RoleID }
        )

        res.status(201).json({ message: "User Created" })

    } catch (err: any) {
        console.error(err.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}
