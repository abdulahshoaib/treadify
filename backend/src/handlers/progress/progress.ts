import type { Request, Response } from "express"
import { query } from "../../database/query.ts"
import { hasPermission } from "../RABC.ts"

const getProductProgress = async (req: Request, res: Response) => {
    if (!req.session.User)
        res.status(401).json({ error: "Unauthorized Access" })

    const role = req.session.User?.role as string

    if(!role)
        res.status(403).json({error: "No role assigned in session"})

    const permissionReq = "getProductProgress"
    const hasPermRes = await hasPermission(role, permissionReq)

    if(!hasPermRes)
        res.status(403).json({error: "Insufficent Permission"})

    try {
        const ProductID = req.session.User?.product

        if (!ProductID)
            res.status(400).json({ error: "Product ID is required" })


        const result = await query(
            `SELECT
                p.ProductID,
                p.Name AS ProductName,
                COUNT(f.FeatureID) AS TotalFeatures,
                SUM(CASE WHEN f.Status = 'completed' THEN 1 ELSE 0 END) AS CompletedFeatures,
                (SUM(CASE WHEN f.Status = 'completed' THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(f.FeatureID), 0) AS ProgressPercentage
            FROM Products p
            LEFT JOIN Features f ON p.ProductID = f.ProductID
            WHERE p.ProductID = @ProductID
            GROUP BY p.ProductID, p.Name`,
            { ProductID }
        )

        if (!result.length)
            res.status(404).json({ error: "No progress found for this product" })

        res.json({ message: `Progress for product ${ProductID}`, data: result[0] })
    } catch (err: any) {
        console.error(err.message)
        res.status(500).json({ error: err.message })
    }
}

const getFeatureProgress = async (req: Request, res: Response) => {
    if (!req.session.User)
        res.status(401).json({ error: "Unauthorized Access" })

    const role = req.session.User?.role as string

    if(!role)
        res.status(403).json({error: "No role assigned in session"})

    const permissionReq = "getFeatureProgress"
    const hasPermRes = await hasPermission(role, permissionReq)

    if(!hasPermRes)
        res.status(403).json({error: "Insufficent Permission"})

    try {
        const FeatureID = req.session.User?.feature

        if (!FeatureID)
            res.status(400).json({ error: "Feature ID is required" })


        const result = await query(
            `SELECT
                f.FeatureID,
                f.Name AS FeatureName,
                COUNT(g.GoalID) AS TotalGoals,
                SUM(CASE WHEN g.Status = 'completed' THEN 1 ELSE 0 END) AS CompletedGoals,
                (SUM(CASE WHEN g.Status = 'completed' THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(g.GoalID), 0)) AS ProgressPercentage
            FROM Features f
            LEFT JOIN Goals g ON f.FeatureID = g.FeatureID
            WHERE f.FeatureID = @FeatureID
            GROUP BY f.FeatureID, f.Name`,
            { FeatureID }
        )

        if (!result.length)
            res.status(404).json({ error: "No progress found for this feature" })


        res.json({ message: `Progress for feature ${FeatureID}`, data: result[0] })
    } catch (error: any) {
        console.error(error.message)
        res.status(500).json({ error: error.message })
    }
}

const getCommitStatus = async (req: Request, res: Response) => {
    if (!req.session.User)
        res.status(401).json({ error: "Unauthorized Access" })

    const role = req.session.User?.role as string

    if(!role)
        res.status(403).json({error: "No role assigned in session"})

    const permissionReq = "getCommitStatus"
    const hasPermRes = await hasPermission(role, permissionReq)

    if(!hasPermRes)
        res.status(403).json({error: "Insufficent Permission"})

    try {
        const { goalID } = req.params

        if (!goalID)
            res.status(400).json({ error: "Goal ID is required" })


        const result = await query(
            "SELECT Status FROM Commits WHERE CommitID = @goalID",
            { goalID }
        )

        if (!result.length)
            res.status(404).json({ error: "No commit status found for this goal" })

        res.json({ message: `Commit status for goal ${goalID}`, data: result[0] })
    } catch (error: any) {
        console.error(error.message)
        res.status(500).json({ error: error.message })
    }
}

const getActiveFeature = async (req: Request, res: Response) => {
    if (!req.session.User)
        res.status(401).json({ error: "Unauthorized Access" })

    const role = req.session.User?.role as string

    if(!role)
        res.status(403).json({error: "No role assigned in session"})

    const permissionReq = "getActiveFeature"
    const hasPermRes = await hasPermission(role, permissionReq)

    if(!hasPermRes)
        res.status(403).json({error: "Insufficent Permission"})

    try {
        const ProductID = req.session.User?.product

        if (!ProductID)
            res.status(400).json({ error: "ProductID not found in session" })

        const result = await query(
            `SELECT * FROM FeatureOverviewView
             WHERE ProductID = @ProductID`,
            { ProductID }
        )

        if (result.length === 0)
            res.status(404).json({ error: "No data found" })

        res.json({ message: `Feature Overview`, data: result })

    } catch (err: any) {
        console.error(err.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

const getGoalStatus = async (req: Request, res: Response) => {
    if (!req.session.User)
        res.status(401).json({ error: "Unauthorized Access" })

    const role = req.session.User?.role as string

    if(!role)
        res.status(403).json({error: "No role assigned in session"})

    const permissionReq = "getGoalStatus"
    const hasPermRes = await hasPermission(role, permissionReq)

    if(!hasPermRes)
        res.status(403).json({error: "Insufficent Permission"})

    try {
        const FeatureID = req.session.User?.feature

        if (!FeatureID)
            res.status(400).json({ error: "FeatureID not found in session" })

        const result = await query(
            `SELECT * FROM GoalStatusView
             WHERE FeatureID = @FeatureID`,
            { FeatureID }
        )

        if (result.length === 0)
            res.status(404).json({ error: "No data found" })

        res.json({ message: `Feature Overview`, data: result })

    } catch (err: any) {
        console.error(err.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

const getCommitOverview = async (req: Request, res: Response) => {
    if (!req.session.User)
        res.status(401).json({ error: "Unauthorized Access" })

    const role = req.session.User?.role as string

    if(!role)
        res.status(403).json({error: "No role assigned in session"})

    const permissionReq = "getCommitOverview"
    const hasPermRes = await hasPermission(role, permissionReq)

    if(!hasPermRes)
        res.status(403).json({error: "Insufficent Permission"})

    try {
        const FeatureID = req.session.User?.feature

        if (!FeatureID)
            res.status(400).json({ error: "FeatureID not found in session" })

        const result = await query(
            `SELECT * FROM CommitOverviewView
             WHERE FeatureID = @FeatureID`,
            { FeatureID }
        )

        if (result.length === 0)
            res.status(404).json({ error: "No data found" })

        res.json({ message: `Feature Overview`, data: result })

    } catch (err: any) {
        console.error(err.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export default {
    getProductProgress,
    getFeatureProgress,
    getCommitStatus,
    getActiveFeature,
    getGoalStatus,
    getCommitOverview
}
