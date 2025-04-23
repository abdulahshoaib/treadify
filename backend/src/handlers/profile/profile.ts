import type { Request, Response } from "express"
import { query } from "../../database/query.ts"
import axios from "axios"

const getUserRepos = async (req: Request, res: Response) => {
    if (!req.session.User)
        res.status(401).json({ error: "Unauthorized Access" })

    try {
        const username = req.session.User?.username

        const result = await query(
            `SELECT ug.AccessToken
            FROM Users u
            JOIN UserGitHubIntegration ug ON u.UserID = ug.UserID
            WHERE u.Username = @username;
            `,
            { username }
        )

        if (!result.length)
            return res.status(404).json({ error: "User not found" })

        const accessToken = result[0].AccessToken

        const githubApiUrl = `https://api.github.com/user/repos`
        const headers = {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/vnd.github.v3+json",
        }

        const response = await axios.get(githubApiUrl, { headers })

        const repos = response.data.map((repo: any) => ({
            name: repo.name,
        }))

        return res.json({
            message: "repos for profile for " + username,
            data: {
                repositories: repos,
            },
        })
    } catch (err: any) {
        return res.status(500).json({ error: err.message })
    }
}

const getUserProfile = async (req: Request, res: Response) => {
    if (!req.session.User)
        return res.status(401).json({ error: "Unauthorized Access" })

    try {
        const username = req.session?.User.username

        const result = await query(
            `SELECT u.FirstName, u.LastName, u.Email, ug.GitHubUsername, r.Name
            FROM Users u
            LEFT JOIN UserGitHubIntegration ug ON u.UserID = ug.UserID
            LEFT JOIN UserRoles ur ON u.UserID = ur.UserID
            LEFT JOIN Roles r ON ur.RoleID = r.RoleID
            WHERE u.Username = @username;
            `,
            { username }
        )
        if (!result.length)
            return res.status(404).json({ error: "User not found" })

        const name = result[0].FirstName + " " + result[0].LastName
        const role = result[0].Name
        const email = result[0].Email
        const ghusername = result[0].GitHubUsername

        return res.json({
            message: `User profile for ${username}`,
            name: name,
            role: role,
            email: email,
            ghusername: ghusername
        })
    } catch (err: any) {
        return res.status(500).json({ error: err.message })
    }
}

const updateUserProfile = async (req: Request, res: Response) => {
    if (!req.session.User)
        res.status(401).json({ error: "Unauthorized Access" })

    try {
        const username = req.session.User?.username
        const { email, name } = req.body

        if (!username && !email) {
            return res.status(400).json({ error: "Username and email are required" })
        }

        if (name) {
            const parts = name.trim().split(/\s+/)

            const Fname = parts[0]
            const Lname = parts[1] || ""

            await query(
                `UPDATE Users SET FirstName = @Fname, LastName = @Lname WHERE Username = @username`,
                { Fname, Lname, username }
            )
        }

        if (email) {
            await query(
                `UPDATE Users SET  Email = @email WHERE Username = @username `,
                { email, username }
            )
        }

        return res.json({ message: `User profile updated for ${username}` })
    } catch (err: any) {
        return res.status(500).json({ error: err.message })
    }
}

export default {
    getUserProfile,
    updateUserProfile,
    getUserRepos,
}

