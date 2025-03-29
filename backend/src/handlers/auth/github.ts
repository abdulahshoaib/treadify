import type { Request, Response } from "express"
import axios from "axios"
import { query } from "../../database/query.ts"

import dotenv from "dotenv";
dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = "http://localhost:3000/auth/github/callback"

const githubAuthHandler = {
    githubAuth: (req: Request, res: Response) => {
        if (!req.session.User)
            res.status(401).json({ error: "Unautorized Access" })
        const githubAuthURL = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo,user:email&redirect_uri=${REDIRECT_URI}`
        res.redirect(githubAuthURL)
    },

    githubCallback: async (req: Request, res: Response) => {
        if (!req.session.User)
            res.status(401).json({ error: "Unautorized Access" })

        const { code } = req.query

        if (!code) {
            res.status(400).json({ error: "Missing GitHub code" })
        }

        try {
            const tokenResponse = await axios.post(
                "https://github.com/login/oauth/access_token",
                {
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET,
                    code,
                },
                { headers: { Accept: "application/json" } }
            )

            const accessToken = tokenResponse.data.access_token
            if (!accessToken) {
                res.status(400).json({ error: "Failed to get GitHub access token" })
            }

            const userResponse = await axios.get("https://api.github.com/user", {
                headers: { Authorization: `Bearer ${accessToken}` },
            })

            const { login: GitHubUsername } = userResponse.data

            // TODO: Get the logged-in user's `userID` (Replace this with actual user authentication logic)
            const userID = req.session.User?.id

            await query(
                `INSERT INTO UserGitHubIntegration (UserID, GitHubUsername, AccessToken)
                 VALUES (@userID, @GitHubUsername, @accessToken)`,
                { userID, GitHubUsername, accessToken }
            )

            res.json({ message: "GitHub linked successfully", GitHubUsername })
        } catch (err: any) {
            console.error("GitHub OAuth Error:", err.response?.data || err.message)
            res.status(500).json({ error: "GitHub authentication failed" })
        }
    }
}

export default githubAuthHandler
