import type { Request, Response } from "express"
import { query } from "../../database/query.ts"

const createProductChannel = async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body

        if (!name || !description) {
            return res.status(400).json({ error: "Name and description are required" })
        }

        const result = await query("INSERT INTO product_channels (name, description) VALUES (?, ?)", [name, description])
        res.status(201).json({ message: `Created product channel: ${name}`, data: result })
    } catch (error: any) {
        console.error(error.message)
        res.status(500).json({ error: error.message })
    }
}

const inviteToChannel = async (req: Request, res: Response) => {
    try {
        const { channelID, userID } = req.body

        if (!channelID || !userID) {
            return res.status(400).json({ error: "Channel ID and User ID are required" })
        }

        const result = await query("INSERT INTO channel_members (channel_id, user_id) VALUES (?, ?)", [channelID, userID])
        res.json({ message: `User ${userID} invited to channel ${channelID}`, data: result })
    } catch (error: any) {
        console.error(error.message)
        res.status(500).json({ error: error.message })
    }
}

const addFeature = async (req: Request, res: Response) => {
    try {
        const { channelID, featureName, description } = req.body

        if (!channelID || !featureName || !description) {
            return res.status(400).json({ error: "Channel ID, Feature Name, and Description are required" })
        }

        const result = await query("INSERT INTO features (channel_id, name, description) VALUES (?, ?, ?)", [channelID, featureName, description])
        res.status(201).json({ message: `Feature ${featureName} added to channel ${channelID}`, data: result })
    } catch (error: any) {
        console.error(error.message)
        res.status(500).json({ error: error.message })
    }
}

const deprecateChannel = async (req: Request, res: Response) => {
    try {
        const { channelID } = req.params

        const result = await query("UPDATE product_channels SET status = 'deprecated' WHERE id = ?", [channelID])
        res.json({ message: `Channel ${channelID} has been deprecated`, data: result })
    } catch (error: any) {
        console.error(error.message)
        res.status(500).json({ error: error.message })
    }
}

const updateFeatureTL = async (req: Request, res: Response) => {
    try {
        const { featureID, timeline } = req.body

        if (!featureID || !timeline) {
            return res.status(400).json({ error: "Feature ID and Timeline are required" })
        }

        const result = await query("UPDATE features SET timeline = ? WHERE id = ?", [timeline, featureID])
        res.json({ message: `Feature ${featureID} timeline updated`, data: result })
    } catch (error: any) {
        console.error(error.message)
        res.status(500).json({ error: error.message })
    }
}

const updateFeatureDeadline = async (req: Request, res: Response) => {
    try {
        const { featureID, deadline } = req.body

        if (!featureID || !deadline) {
            return res.status(400).json({ error: "Feature ID and Deadline are required" })
        }

        const result = await query("UPDATE features SET deadline = ? WHERE id = ?", [deadline, featureID])
        res.json({ message: `Feature ${featureID} deadline updated`, data: result })
    } catch (error: any) {
        console.error(error.message)
        res.status(500).json({ error: error.message })
    }
}

const getChannelDeadline = async (req: Request, res: Response) => {
    try {
        const { channelID } = req.params

        const result = await query("SELECT deadline FROM product_channels WHERE id = ?", [channelID])
        if (!result.length) {
            return res.status(404).json({ error: "Channel not found" })
        }

        res.json({ message: `Deadline for channel ${channelID}`, data: result })
    } catch (error: any) {
        console.error(error.message)
        res.status(500).json({ error: error.message })
    }
}

const getChannelMembers = async (req: Request, res: Response) => {
    try {
        const { channelID } = req.params

        const result = await query(
            "SELECT users.* FROM users JOIN channel_members ON users.id = channel_members.user_id WHERE channel_members.channel_id = ?",
            [channelID]
        )

        res.json({ message: `Members of channel ${channelID}`, data: result })
    } catch (error: any) {
        console.error(error.message)
        res.status(500).json({ error: error.message })
    }
}

const getChannelGoals = async (req: Request, res: Response) => {
    try {
        const { channelID } = req.params

        const result = await query("SELECT * FROM goals WHERE channel_id = ?", [channelID])

        res.json({ message: `Goals for channel ${channelID}`, data: result })
    } catch (error: any) {
        console.error(error.message)
        res.status(500).json({ error: error.message })
    }
}

const getChannelReport = async (req: Request, res: Response) => {
    try {
        const { channelID } = req.params

        const result = await query(`
            SELECT
                c.name AS channel_name,
                COUNT(DISTINCT m.user_id) AS total_members,
                COUNT(DISTINCT f.id) AS total_features,
                COUNT(DISTINCT g.id) AS total_goals
            FROM product_channels c
            LEFT JOIN channel_members m ON c.id = m.channel_id
            LEFT JOIN features f ON c.id = f.channel_id
            LEFT JOIN goals g ON c.id = g.channel_id
            WHERE c.id = ?
            GROUP BY c.name
        `, [channelID])

        if (!result.length) {
            return res.status(404).json({ error: "Channel not found" })
        }

        res.json({ message: `Report for channel ${channelID}`, data: result })
    } catch (error: any) {
        console.error(error.message)
        res.status(500).json({ error: error.message })
    }
}

export default {
    createProductChannel,
    inviteToChannel,
    addFeature,
    deprecateChannel,
    updateFeatureTL,
    updateFeatureDeadline,
    getChannelDeadline,
    getChannelGoals,
    getChannelMembers,
    getChannelReport,
}

