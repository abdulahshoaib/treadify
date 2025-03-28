import type { Request, Response } from "express"
import { query } from "../../database/query.ts"

const createFeatureGoals = async (req: Request, res: Response) => {
    try {
        const { channelID } = req.params
        const { goal } = req.body

        if (!goal) {
            return res.status(400).json({ error: "Goal is required" })
        }

        const result = await query("INSERT INTO goals (channel_id, goal) VALUES (?, ?)", [channelID, goal])

        res.status(201).json({ message: `Created feature goal: ${goal} @ channel ${channelID}`, data: result })
    } catch (err: any) {
        console.error(err.message)
        res.status(500).json({ error: err.message })
    }
}

const commitToGoal = async (req: Request, res: Response) => {
    try {
        const { channelID, goalID } = req.params
        const { userID } = req.body

        if (!userID) {
            return res.status(400).json({ error: "User ID is required to commit to a goal" })
        }

        const result = await query("INSERT INTO goal_commits (user_id, goal_id, channel_id) VALUES (?, ?, ?)", [userID, goalID, channelID])
        res.json({ message: `User ${userID} committed to goal ${goalID} @ channel ${channelID}`, data: result })
    } catch (err: any) {
        console.error(err.message)
        res.status(500).json({ error: err.message })
    }
}

const getFeatureChannel = async (req: Request, res: Response) => {
    try {
        const { channelID } = req.params
        const result = await query("SELECT * FROM feature_channels WHERE channel_id = ?", [channelID])

        if (!result.length) {
            return res.status(404).json({ error: "Feature channel not found" })
        }

        res.json({ message: `Feature channel details for ${channelID}`, data: result })
    } catch (err: any) {
        console.error(err.message)
        res.status(500).json({ error: err.message })
    }
}

const getFeatureMembers = async (req: Request, res: Response) => {
    try {
        const { channelID } = req.params
        const result = await query("SELECT users.* FROM users JOIN channel_members ON users.id = channel_members.user_id WHERE channel_members.channel_id = ?", [channelID])

        res.json({ message: `Members of channel ${channelID}`, data: result })
    } catch (err: any) {
        console.error(err.message)
        res.status(500).json({ error: err.message })
    }
}

const getFeatureGoals = async (req: Request, res: Response) => {
    try {
        const { channelID } = req.params
        const result = await query("SELECT * FROM goals WHERE channel_id = ?", [channelID])

        res.json({ message: `Feature goals for channel ${channelID}`, data: result })
    } catch (err: any) {
        console.error(err.message)
        res.status(500).json({ error: err.message })
    }
}

const updateCommit = async (req: Request, res: Response) => {
    try {
        const { commitID } = req.params
        const { status } = req.body

        if (!status) {
            return res.status(400).json({ error: "Status is required for update" })
        }

        const result = await query("UPDATE goal_commits SET status = ? WHERE commit_id = ?", [status, commitID])

        res.json({ message: `Updated commit ${commitID} with status ${status}`, data: result })
    } catch (err: any) {
        console.error(err.message)
        res.status(500).json({ error: err.message })
    }
}

export default {
    createFeatureGoals,
    commitToGoal,
    getFeatureChannel,
    getFeatureMembers,
    getFeatureGoals,
    updateCommit
}
