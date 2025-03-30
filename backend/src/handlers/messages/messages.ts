import type { Request, Response } from "express"
import { query } from "../../database/query.ts"

const sendFeatureMessage = async (req: Request, res: Response) => {
    if (!req.session.User)
        res.status(401).json({ error: "Unauthorized Access" })

    try {
        const ProductID = req.session.User?.product
        const FeatureID = req.session.User?.feature
        const UserID = req.session.User?.id
        const { message } = req.body

        if (!FeatureID || !UserID || !message) {
            res.status(400).json({ error: "Feature ID, User ID, and Message are required" })
        }

        const channelResult = await query("SELECT ChannelID FROM Channels WHERE ProductID = @ProductID AND FeatureID = @FeatureID",
            { ProductID, FeatureID })

        if (!channelResult.length)
            res.status(404).json({ error: "Channel not found" })

        const ChannelID = channelResult[0].ChannelID

        const result = await query(
            "INSERT INTO Messages (ChannelID, SenderID, Content) VALUES (@ChannelID, @UserID, @message)",
            { ChannelID, UserID, message }
        )

        res.status(201).json({ message: "Message sent in feature channel", data: result })
    } catch (err: any) {
        console.error(err.message)
        res.status(500).json({ error: err.message })
    }
}

const sendProductMessage = async (req: Request, res: Response) => {
    if (!req.session.User)
        res.status(401).json({ error: "Unauthorized Access" })

    try {
        const ProductID = req.session.User?.product
        const UserID = req.session.User?.id
        const { message } = req.body

        if (!ProductID || !UserID || !message) {
            res.status(400).json({ error: "Feature ID, User ID, and Message are required" })
        }

        const channelResult = await query("SELECT ChannelID FROM Channels WHERE ProductID = @ProductID AND FeatureID IS NULL",
            { ProductID })

        if (!channelResult.length)
            res.status(404).json({ error: "Channel not found" })

        const ChannelID = channelResult[0].ChannelID

        const result = await query(
            "INSERT INTO Messages (ChannelID, SenderID, Content) VALUES (@ChannelID, @UserID, @message)",
            { ChannelID, UserID, message }
        )

        res.status(201).json({ message: "Message sent in Product channel", data: result })
    } catch (err: any) {
        console.error(err.message)
        res.status(500).json({ error: err.message })
    }
}

const getFeatureMessages = async (req: Request, res: Response) => {
    if (!req.session.User)
        res.status(401).json({ error: "Unauthorized Access" })

    try {
        const FeatureID = req.session.User?.feature
        const ProductID = req.session.User?.product

        const channelResult = await query("SELECT ChannelID FROM Channels WHERE ProductID = @ProductID AND FeatureID = @FeatureID",
            { ProductID, FeatureID })

        if (!channelResult.length)
            res.status(404).json({ error: "Channel not found" })

        const ChannelID = channelResult[0].ChannelID

        const result = await query(
            "SELECT * FROM Messages WHERE ChannelID = @ChannelID ORDER BY CreatedAt DESC",
            { ChannelID }
        )

        res.json({ message: `Messages for feature ${FeatureID}`, data: result })
    } catch (err: any) {
        console.error(err.message)
        res.status(500).json({ error: err.message })
    }
}

// Get all messages from a product channel
const getProductMessages = async (req: Request, res: Response) => {
    if (!req.session.User)
        res.status(401).json({ error: "Unauthorized Access" })
    try {
        const ProductID = req.session.User?.product

        const channelResult = await query(
            "SELECT ChannelID FROM Channels WHERE ProductID = @ProductID AND FeatureID IS NULL",
            { ProductID }
        )

        if (!channelResult.length)
            res.status(404).json({ error: "Channel not found" })

        const ChannelID = channelResult[0].ChannelID

        const result = await query(
            "SELECT * FROM Messages WHERE ChannelID = @ChannelID ORDER BY CreatedAt DESC",
            { ChannelID }
        )

        res.json({ message: `Messages for product channel ${ChannelID}`, data: result })
    } catch (err: any) {
        console.error(err.message)
        res.status(500).json({ error: err.message })
    }
}

const deleteFeatureMessage = async (req: Request, res: Response) => {
    if (!req.session.User)
        res.status(401).json({ error: "Unauthorized Access" })
    try {
        const ProductID = req.session.User?.product
        const FeatureID = req.session.User?.feature
        const UserID = req.session.User?.id
        const { MessageID } = req.body

        const channelResult = await query(
            "SELECT ChannelID FROM Channels WHERE ProductID = @ProductID AND FeatureID = @FeatureID",
            { ProductID, FeatureID }
        )

        if (!channelResult.length)
            res.status(404).json({ error: "Channel not found" })

        const ChannelID = channelResult[0].ChannelID

        const result = await query("DELETE FROM Message WHERE MessageID = @MessageID AND SenderID = @UserID AND ChannelID = @ChannelID",
            { MessageID, UserID, ChannelID })

        res.json({ message: `Deleted feature message ${MessageID}`, data: result })
    } catch (err: any) {
        console.error(err.message)
        res.status(500).json({ error: err.message })
    }
}

const deleteProductMessage = async (req: Request, res: Response) => {
    if (!req.session.User)
        res.status(401).json({ error: "Unauthorized Access" })
    try {
        const ProductID = req.session.User?.product
        const UserID = req.session.User?.id
        const { MessageID } = req.body

        const channelResult = await query(
            "SELECT ChannelID FROM Channels WHERE ProductID = @ProductID AND FeatureID IS NULL",
            { ProductID }
        )

        if (!channelResult.length)
            res.status(404).json({ error: "Channel not found" })

        const ChannelID = channelResult[0].ChannelID

        const result = await query("DELETE FROM Message WHERE MessageID = @MessageID AND SenderID = @UserID AND ChannelID = @ChannelID",
            { MessageID, UserID, ChannelID })

        res.json({ message: `Deleted product message ${MessageID}`, data: result })
    } catch (err: any) {
        console.error(err.message)
        res.status(500).json({ error: err.message })
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
