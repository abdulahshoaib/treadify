import type { Request, Response } from "express"
import { query } from "../../database/query.ts"
import axios from "axios"
import { hasPermission } from "../RABC.ts"

const createProductChannel = async (req: Request, res: Response) => {
    console.log("\n\n\n [ROUTE HIT] /productchannel")
    if (!req.session.User)
        return res.status(401).json({ error: "Unauthorized Access" })
    const role = req.session.User?.role as string
    if (!role)
        return res.status(403).json({ error: "No role assigned in session" })
    const permissionReq = "create_product"
    const hasPermRes = await hasPermission(role, permissionReq)
    if (!hasPermRes)
        return res.status(403).json({ error: "Insufficent Permission" })
    try {
        const PMID = req.session.User?.id
        const { Name, RepoName, Deadline } = req.body
        console.log("\n\n", Name, RepoName, Deadline)

        // Changed variable names to match what's coming from frontend
        if (!Name || !RepoName || !Deadline)
            return res.status(400).json({ error: "name, repo, and Deadline are required" })

        const tokenResult = await query(
            `SELECT GitHubUsername, AccessToken
            FROM UserGitHubIntegration WHERE
            UserID = @PMID`,
            { PMID }
        )
        if (!tokenResult.length)
            return res.status(403).json({ error: "User Not Found" })

        console.log(tokenResult)
        const accessToken = tokenResult[0]?.AccessToken
        const RepoOwner = tokenResult[0]?.GitHubUsername
        console.log(accessToken + " " + RepoOwner)

        if (!accessToken)
            return res.status(401).json({ error: "GitHub account not connected" })

        const githubResponse = await axios.get(`https://api.github.com/repos/${RepoOwner}/${RepoName}`, {
            headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/vnd.github+json" }
        })
        const { default_branch: DefaultBranch, html_url: RepoURL } = githubResponse.data
        console.log(DefaultBranch + " " + RepoURL)

        const productResult = await query(
            `INSERT INTO Products (Name, Description, Deadline, PMID)
             OUTPUT INSERTED.ProductID
             VALUES (@Name, @Description, @Deadline, @PMID)`,
            { Name, Description: "", Deadline, PMID }
        )

        const ProductID = productResult[0]?.ProductID
        if (!ProductID)
            return res.status(401).json({ error: "Failed to create product" })

        await query(
            `INSERT INTO GitHubRepositories (ProductID, RepoOwner, RepoName, RepoURL, DefaultBranch)
             VALUES (@ProductID, @RepoOwner, @RepoName, @RepoURL, @DefaultBranch)`,
            { ProductID, RepoOwner, RepoName, RepoURL, DefaultBranch }
        )

        return res.status(201).json({ Name, message: `Created product: ${Name} with GitHub repo`, ProductID })
    } catch (error: any) {
        console.error(error.message)
        return res.status(500).json({ error: error.message })
    }
}

const addFeature = async (req: Request, res: Response) => {
    if (!req.session.User)
        return res.status(401).json({ error: "Unauthorized Access" })

    const role = req.session.User?.role as string

    if (!role)
        return res.status(403).json({ error: "No role assigned in session" })

    const permissionReq = "addFeature"
    const hasPermRes = await hasPermission(role, permissionReq)

    if (!hasPermRes)
        return res.status(403).json({ error: "Insufficent Permission" })

    try {
        const ProductID = req.session.User?.product
        const { featureName, description, TLID } = req.body

        if (!ProductID)
            return res.status(404).json({ error: "No Product channel found" })

        if (!featureName || !description)
            return res.status(400).json({ error: "Feature Name, and Description are required" })

        const result = await query(
            "INSERT INTO Features (ProductID, Name, Description, Deadline, TLID) VALUES (@ProductID, @Name, @Description, @Deadline, @TLID)",
            { ProductID, Name: featureName, Description: description, Deadline: new Date(), TLID }
        )

        return res.status(201).json({ message: `Feature ${featureName} added to channel`, data: result })
    } catch (error: any) {
        console.error(error.message)
        return res.status(500).json({ error: error.message })
    }
}

const deprecateChannel = async (req: Request, res: Response) => {
    if (!req.session.User)
        return res.status(401).json({ error: "Unauthorized Access" })

    const role = req.session.User?.role as string

    if (!role)
        return res.status(403).json({ error: "No role assigned in session" })

    const permissionReq = "deprecateChannel"
    const hasPermRes = await hasPermission(role, permissionReq)

    if (!hasPermRes)
        return res.status(403).json({ error: "Insufficent Permission" })

    try {
        const ProductID = req.session.User?.product

        const result = await query(
            "UPDATE Products SET status = 'deprecated' WHERE ProductID = @ProductID",
            { ProductID }
        )
        res.json({ message: `Channel ${ProductID} has been deprecated`, data: result })
    } catch (error: any) {
        console.error(error.message)
        return res.status(500).json({ error: error.message })
    }
}

const updateFeatureDeadline = async (req: Request, res: Response) => {
    if (!req.session.User)
        return res.status(401).json({ error: "Unauthorized Access" })

    const role = req.session.User?.role as string

    if (!role)
        return res.status(403).json({ error: "No role assigned in session" })

    const permissionReq = "updateFeatureDeadline"
    const hasPermRes = await hasPermission(role, permissionReq)

    if (!hasPermRes)
        return res.status(403).json({ error: "Insufficent Permission" })

    try {
        const { featureID, Deadline } = req.body

        if (!featureID || !Deadline)
            return res.status(400).json({ error: "Feature ID and Deadline are required" })

        const result = await query(
            "UPDATE Features SET Deadline = @Deadline WHERE FeatureID = @FeatureID",
            { Deadline: Deadline, FeatureID: featureID }
        )

        res.json({ message: `Feature ${featureID} Deadline updated`, data: result })
    } catch (error: any) {
        console.error(error.message)
        return res.status(500).json({ error: error.message })
    }
}

const getChannelDeadline = async (req: Request, res: Response) => {
    if (!req.session.User)
        return res.status(401).json({ error: "Unauthorized Access" })

    try {
        const ProductID = req.session.User?.product

        const result = await query(
            "SELECT Deadline FROM Products WHERE ProductID = @ProductID",
            { ProductID }
        )

        if (!result.length)
            return res.status(404).json({ error: "Channel not found" })

        res.json({ message: `Deadline for channel ${ProductID}`, data: result })
    } catch (error: any) {
        console.error(error.message)
        return res.status(500).json({ error: error.message })
    }
}

const getChannelMembers = async (req: Request, res: Response) => {
    if (!req.session.User)
        return res.status(401).json({ error: "Unauthorized Access" })

    // no need for RBAC users can get

    try {
        const ProductID = req.session.User?.product

        const result = await query(
            `SELECT u.*
             FROM Users u
             JOIN ChannelMembers cm ON u.UserID = cm.UserID
             WHERE cm.ProductID = @ProductID `,
            { ProductID }
        )

        res.json({ message: `Members of channel ${ProductID}`, data: result })
    } catch (error: any) {
        console.error(error.message)
        return res.status(500).json({ error: error.message })
    }
}

const getChannelGoals = async (req: Request, res: Response) => {
    if (!req.session.User)
        return res.status(401).json({ error: "Unauthorized Access" })

    // no need for RBAC users can get

    try {
        const ProductID = req.session.User?.product

        const result = await query(
            `SELECT f.FeatureID, f.Name
            FROM Features f
            WHERE f.ProductID = @ProductID`,
            { ProductID }
        )

        res.json({ message: `Goals for channel ${ProductID}`, data: result })
    } catch (error: any) {
        console.error(error.message)
        return res.status(500).json({ error: error.message })
    }
}

const getChannelReport = async (req: Request, res: Response) => {
    if (!req.session.User)
        return res.status(401).json({ error: "Unauthorized Access" })

    try {
        const ProductID = req.session.User?.product

        const result = await query(`
            SELECT
                p.Name AS ProductName,
                COUNT(DISTINCT cm.UserID) AS TotalMembers,
                COUNT(DISTINCT f.FeatureID) AS TotalFeatures,
                COUNT(DISTINCT g.GoalID) AS TotalGoals
            FROM Products p
            LEFT JOIN ChannelMembers cm ON p.ProductID = cm.ProductID
            LEFT JOIN Features f ON p.ProductID = f.ProductID
            LEFT JOIN Goals g ON f.FeatureID = g.FeatureID
            WHERE p.ProductID = @ProductID
            GROUP BY p.Name`,
            { ProductID }
        );

        if (!result.length) {
            return res.status(404).json({ error: "Channel not found" })
        }

        res.json({ message: `Report for channel ${ProductID}`, data: result })
    } catch (error: any) {
        console.error(error.message)
        return res.status(500).json({ error: error.message })
    }
}

export default {
    createProductChannel,
    addFeature,
    deprecateChannel,
    updateFeatureDeadline,
    getChannelDeadline,
    getChannelGoals,
    getChannelMembers,
    getChannelReport,
}
