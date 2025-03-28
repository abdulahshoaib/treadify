import type { Request, Response } from "express"
import { query } from "../../database/query.ts"

// Get user profile by username
const getUserProfile = async (req: Request, res: Response) => {
    try {
        const { username } = req.params

        if (!username) {
            return res.status(400).json({ error: "Username is required" })
        }

        const result = await query("SELECT * FROM users WHERE username = ?", [username])

        if (!result.length) {
            return res.status(404).json({ error: "User not found" })
        }

        res.json({ message: `User profile for ${username}`, data: result[0] })
    } catch (err: any) {
        console.error(err.message)
        res.status(500).json({ error: err.message })
    }
}

// Update user profile
const updateUserProfile = async (req: Request, res: Response) => {
    try {
        const { username } = req.params
        const { email, bio, profilePicture } = req.body

        if (!username || !email) {
            return res.status(400).json({ error: "Username and email are required" })
        }

        const result = await query(
            "UPDATE users SET email = ?, bio = ?, profile_picture = ? WHERE username = ?",
            [email, bio || null, profilePicture || null, username]
        )

        res.json({ message: `User profile updated for ${username}`, data: result })
    } catch (err: any) {
        console.error(err.message)
        res.status(500).json({ error: err.message })
    }
}

export default {
    getUserProfile,
    updateUserProfile,
}

