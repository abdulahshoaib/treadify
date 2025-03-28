import type { Request, Response } from "express"
import { query } from "../../database/query.ts"

const getProductProgress = async (req: Request, res: Response) => {
    try {
        const { productID } = req.params

        if (!productID) {
            return res.status(400).json({ error: "Product ID is required" })
        }

        const result = await query(
            "SELECT progress FROM product_progress WHERE product_id = ?",
            [productID]
        )

        if (!result.length) {
            return res.status(404).json({ error: "No progress found for this product" })
        }

        res.json({ message: `Progress for product ${productID}`, data: result[0] })
    } catch (error: any) {
        console.error(error.message)
        res.status(500).json({ error: error.message })
    }
}

const getFeatureProgress = async (req: Request, res: Response) => {
    try {
        const { featureID } = req.params

        if (!featureID) {
            return res.status(400).json({ error: "Feature ID is required" })
        }

        const result = await query(
            "SELECT progress FROM feature_progress WHERE feature_id = ?",
            [featureID]
        )

        if (!result.length) {
            return res.status(404).json({ error: "No progress found for this feature" })
        }

        res.json({ message: `Progress for feature ${featureID}`, data: result[0] })
    } catch (error: any) {
        console.error(error.message)
        res.status(500).json({ error: error.message })
    }
}

const getCommitStatus = async (req: Request, res: Response) => {
    try {
        const { goalID } = req.params

        if (!goalID) {
            return res.status(400).json({ error: "Goal ID is required" })
        }

        const result = await query(
            "SELECT status FROM goal_commits WHERE goal_id = ?",
            [goalID]
        )

        if (!result.length) {
            return res.status(404).json({ error: "No commit status found for this goal" })
        }

        res.json({ message: `Commit status for goal ${goalID}`, data: result[0] })
    } catch (error: any) {
        console.error(error.message)
        res.status(500).json({ error: error.message })
    }
}

const updateCommitStatus = async (req: Request, res: Response) => {
    try {
        const { goalID } = req.params
        const { status } = req.body

        if (!goalID || !status) {
            return res.status(400).json({ error: "Goal ID and status are required" })
        }

        const result = await query(
            "UPDATE goal_commits SET status = ? WHERE goal_id = ?",
            [status, goalID]
        )

        res.json({ message: `Commit status updated for goal ${goalID}`, data: result })
    } catch (error: any) {
        console.error(error.message)
        res.status(500).json({ error: error.message })
    }
}

export default {
    getProductProgress,
    getFeatureProgress,
    getCommitStatus,
    updateCommitStatus,
}
