import type { Request, Response } from "express"
import bcrypt from "bcrypt"

import { query } from "../../database/query.ts"

export const signup = async (req: Request, res: Response) => {
    try {
        const { FirstName, LastName, username, email, pass } = req.body

        if (!username || !email || !pass)
            res.status(400).json({ error: "Invalid Input" })

        // hash the password
        const hash = await bcrypt.hash(pass, 10)

        await query(
            `INSERT INTO Users (FirstName, LastName, Username, Email, Pass)
             VALUES (@FirstName, @LastName, @username, @email, @hash)`,
            { FirstName, LastName, username, email, hash }
        )
        res.status(201).json({ message: "User Created" })

    } catch (err: any) {
        console.error(err.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}
