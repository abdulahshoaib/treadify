import type { Request, Response } from "express"
import { query } from "../../database/query.ts"

// Send a message in a feature channel
const sendFeatureMessage = async (req: Request, res: Response) => {
    try {
        const { featureID, userID, message } = req.body

        if (!featureID || !userID || !message) {
            return res.status(400).json({ error: "Feature ID, User ID, and Message are required" })
        }

        const result = await query(
            "INSERT INTO feature_messages (feature_id, user_id, message) VALUES (?, ?, ?)",
            [featureID, userID, message]
        )

        res.status(201).json({ message: "Message sent in feature channel", data: result })
    } catch (error: any) {
        console.error(error.message)
        res.status(500).json({ error: error.message })
    }
}

// Send a message in a product channel
const sendProductMessage = async (req: Request, res: Response) => {
    try {
        const { channelID, userID, message } = req.body

        if (!channelID || !userID || !message) {
            return res.status(400).json({ error: "Channel ID, User ID, and Message are required" })
        }

        const result = await query(
            "INSERT INTO product_messages (channel_id, user_id, message) VALUES (?, ?, ?)",
            [channelID, userID, message]
        )

        res.status(201).json({ message: "Message sent in product channel", data: result })
    } catch (error: any) {
        console.error(error.message)
        res.status(500).json({ error: error.message })
    }
}

// Get all messages from a feature channel
const getFeatureMessages = async (req: Request, res: Response) => {
    try {
        const { featureID } = req.params

        const result = await query(
            "SELECT * FROM feature_messages WHERE feature_id = ? ORDER BY created_at DESC",
            [featureID]
        )

        res.json({ message: `Messages for feature ${featureID}`, data: result })
    } catch (error: any) {
        console.error(error.message)
        res.status(500).json({ error: error.message })
    }
}

// Get all messages from a product channel
const getProductMessages = async (req: Request, res: Response) => {
    try {
        const { channelID } = req.params

        const result = await query(
            "SELECT * FROM product_messages WHERE channel_id = ? ORDER BY created_at DESC",
            [channelID]
        )

        res.json({ message: `Messages for product channel ${channelID}`, data: result })
    } catch (error: any) {
        console.error(error.message)
        res.status(500).json({ error: error.message })
    }
}

// Delete a specific message from a feature channel
const deleteFeatureMessage = async (req: Request, res: Response) => {
    try {
        const { messageID } = req.params

        const result = await query("DELETE FROM feature_messages WHERE id = ?", [messageID])

        res.json({ message: `Deleted feature message ${messageID}`, data: result })
    } catch (error: any) {
        console.error(error.message)
        res.status(500).json({ error: error.message })
    }
}

// Delete a specific message from a product channel
const deleteProductMessage = async (req: Request, res: Response) => {
    try {
        const { messageID } = req.params

        const result = await query("DELETE FROM product_messages WHERE id = ?", [messageID])

        res.json({ message: `Deleted product message ${messageID}`, data: result })
    } catch (error: any) {
        console.error(error.message)
        res.status(500).json({ error: error.message })
    }
}

export default {
    sendFeatureMessage,
    sendProductMessage,
    getFeatureMessages,
    getProductMessages,
    deleteFeatureMessage,
    deleteProductMessage,
}

