import type { Response, Request } from "express"

import { query } from "../../database/query.ts"

export const validateCode = async (req: Request, res: Response) => {
    if (!req.session)
        return res.status(401).json({ error: "Unauthorized" })

    try {
        const { code } = req.body.code

        if (!code)
            return res.status(400).json({ error: "Code is required" })

        const result = await query(`
            SELECT 1 FROM ChannelInvites WHERE Code = @code`,
            { code }
        )

        if (result.length === 0){
            console.log("Invalid code")
            return res.status(400).json({ error: "Invalid code" })
        }

        const channel = await query(`
            SELECT ChannelId FROM ChannelInvites WHERE Code = @code`,
            { code }
        )

        if (channel.length === 0)
            return res.status(400).json({ error: "Invalid code" })

        const channelID = channel[0].ChannelId

        if (req.session.User) {
            req.session.User = {
                ...req.session.User,
                channel: channelID
            }
        }

        console.log("Code is valid")
        return res.status(200).json({ message: "Code is valid", channelID: channelID })

    } catch (err: any) {
        console.log(err.message)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export const generateCode = async (req: Request, res: Response, channelID: string) => {
    if (!req.session)
        return res.status(401).json({ error: "Unauthorized" })
    try {
        const { channelID } = req.body
        if (!channelID)
            return res.status(400).json({ error: "Channel ID is required" })

        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"

        const genCode = () => {
            let code = ""
            for (let i = 0; i < 8; ++i)
                code += chars.charAt(Math.floor(Math.random() * chars.length))
            return code
        }

        let code = ""
        let unique = false
        while (!unique) {
            const candidate = genCode()

            const result = await query(`
                SELECT 1 FROM ChannelInvites WHERE Code = @code`,
                { code: candidate }
            )

            if (result.length === 0) {
                unique = true
                code = candidate
            }
        }

        await query(`
            INSERT INTO ChannelInvites (Code, ChannelID)
            VALUES (@code, @channelID)`,
            { code, channelID: channelID }
        )

    } catch (err: any) {
        console.log(err.message)
        return res.status(500).json({ error: "Internal server error" })
    }
}
