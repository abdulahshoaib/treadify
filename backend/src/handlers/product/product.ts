import type { Request, Response } from "express"
import { query } from "../../database/query.ts"
import axios from "axios"
import { hasPermission } from "../RABC.ts"

const createProductChannel = async (req: Request, res: Response) => {
    if (!req.session.User)
        return res.status(401).json({ error: "Unauthorized Access" })

    try {
        const PMID = req.session.User?.id
        const { Name, RepoName, Deadline } = req.body

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

        const accessToken = tokenResult[0]?.AccessToken
        const RepoOwner = tokenResult[0]?.GitHubUsername

        if (!accessToken)
            return res.status(401).json({ error: "GitHub account not connected" })

        const githubResponse = await axios.get(`https://api.github.com/repos/${RepoOwner}/${RepoName}`, {
            headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/vnd.github+json" }
        })
        const { default_branch: DefaultBranch, html_url: RepoURL } = githubResponse.data

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

        const channelResult = await query(
            `INSERT INTO Channels (ProductID, Type)
             OUTPUT INSERTED.ChannelID
             VALUES (@ProductID, 'product')`,
            { ProductID }
        )

        const ChannelID = channelResult[0]?.ChannelID
        if (!ChannelID)
            return res.status(401).json({ error: "Failed to create channel" })

        await query(
            `INSERT INTO ChannelMembers (UserID, ProductID, Role)
             VALUES (@UserID, @ProductID, 'PM')`,
            { UserID: PMID, ProductID }
        )

        return res.status(201).json({
            Name,
            message: `Created product: ${Name} with GitHub repo`,
            ProductID,
            ChannelID
        })
    } catch (error: any) {
        console.error(error.message)
        return res.status(500).json({ error: error.message })
    }
}

const addFeature = async (req: Request, res: Response) => {
    if (!req.session.User)
        return res.status(401).json({ error: "Unauthorized Access" })

    try {
        const ProductID = req.session.User?.product
        const { name, description, deadline, TLID } = req.body

        if (!ProductID)
            return res.status(404).json({ error: "No Product channel found" })

        if (!name || !description)
            return res.status(400).json({ error: "Feature Name, and Description are required" })


        const result = await query(
            `INSERT INTO Features (ProductID, Name, Description, Deadline, TLID)
           OUTPUT INSERTED.FeatureID
           VALUES (@ProductID, @Name, @Description, @Deadline, @TLID)`,
            { ProductID, Name: name, Description: description, Deadline: deadline, TLID, }
        )

        const featureID = result[0].FeatureID

        await query(
            `UPDATE ChannelMembers
             SET FeatureID = @FeatureID,
               IsActive = 0
             WHERE UserID = @TLID AND ProductID = @ProductID AND FeatureID IS NULL`,
            { TLID, ProductID, FeatureID: featureID }
        )

        await query(
            `INSERT INTO Channels (ProductID, FeatureID, Type)
             VALUES (@ProductID, @FeatureID, 'feature')`,
            { ProductID, FeatureID: featureID, }
        )

        return res.status(201).json({ message: `Feature ${name} added to channel`, data: result })
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

const getTL = async (req: Request, res: Response) => {
    if (!req.session.User)
        return res.status(401).json({ error: "Unauthorized Access" })
    try {
        const ProductID = req.session.User?.product

        const result = await query(
            `SELECT u.FirstName, u.LastName, u.UserID
             FROM Users u
             JOIN ChannelMembers cm ON u.UserID = cm.UserID
             WHERE cm.ProductID = @ProductID
               AND cm.Role = 'TL'
               AND cm.IsActive = 1`, // role 1003 -> TL
            { ProductID }
        )

        return res.json({ data: result })
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
        )

        if (!result.length) {
            return res.status(404).json({ error: "Channel not found" })
        }

        res.json({ message: `Report for channel ${ProductID}`, data: result })
    } catch (error: any) {
        console.error(error.message)
        return res.status(500).json({ error: error.message })
    }
}

const getFeatures = async (req: Request, res: Response) => {
    if (!req.session.User)
        return res.status(401).json({ error: "Unauthorized Access" })

    try {
        const ProductID = req.session.User?.product

        const result = await query(`
            SELECT
                CONCAT('feature-', F.FeatureID) AS id,
                F.Name,
                MAX(CAST(F.Description AS NVARCHAR(MAX))) AS Description,
                CONCAT(U.FirstName, ' ', U.LastName) AS AssignedTo,
                CONVERT(VARCHAR, F.Deadline, 23) AS deadline,
                COUNT(G.GoalID) AS totalGoals,
                SUM(CASE WHEN G.Status = 'completed' THEN 1 ELSE 0 END) AS completedGoals,
                CAST(CASE
                        WHEN COUNT(G.GoalID) = 0 THEN 0
                        ELSE (SUM(CASE WHEN G.Status = 'completed' THEN 1 ELSE 0 END) * 100.0 / COUNT(G.GoalID))
                    END AS INT) AS progress
            FROM Features F
            LEFT JOIN Users U ON F.TLID = U.UserID
            LEFT JOIN Goals G ON F.FeatureID = G.FeatureID
            LEFT JOIN Products P on P.ProductID = F.ProductID
            WHERE P.ProductID = @ProductID
            GROUP BY F.FeatureID, F.Name, F.TLID, F.Deadline, U.FirstName, U.LastName
            `,
            { ProductID }
        )

        if (!result.length) {
            console.log(result)
            return res.status(206).json({ error: "Channel not found" })
        }

        res.json({ message: `Report for channel ${ProductID}`, data: result })
    } catch (error: any) {
        console.error(error.message)
        return res.status(500).json({ error: error.message })
    }
}

const getChannelDetails = async (req: Request, res: Response) => {
    if (!req.session.User)
        return res.status(401).json({ error: "Unauthorized Access" })

    try {
        const UserId = req.session.User.id
        const ProductID = req.session.User.product

        const product = await query(`
            SELECT
                p.ProductID,
                p.Name,
                p.Description,
                CONVERT(VARCHAR, p.Deadline, 23) AS deadline,
                gr.RepoOwner,
                gr.RepoName,
                gr.RepoURL
            FROM Products p
            JOIN GitHubRepositories gr ON p.ProductID = gr.ProductID
            WHERE p.ProductID = @ProductID AND p.PMID = @UserID
        `, { ProductID, UserId })

        if (product.length === 0) {
            console.log("no product assigned")
            return res.status(404).json({ error: "Product channel not found" })
        }

        const productData = product[0]

        const githubToken = await query(`
            SELECT AccessToken FROM UserGitHubIntegration
            WHERE UserID = @UserID
        `, { UserId })

        const accessToken = githubToken[0].AccessToken
        const repoStats = await axios.get(
            `https://api.github.com/repos/${productData.RepoOwner}/${productData.RepoName}`,
            {
                headers: {
                    'Authorization': `token ${accessToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            }
        ).then(res => res.data)
            .catch(err => {
                console.error("GitHub API error:", err)
                return null
            })

        const features = await query(`
            SELECT
                F.FeatureID AS id,
                F.Name,
                F.Description,
                CONCAT(U.FirstName, ' ', U.LastName) AS assignedTo,
                CONVERT(VARCHAR, F.Deadline, 23) AS deadline,
                COUNT(G.GoalID) AS totalGoals,
                SUM(CASE WHEN G.Status = 'completed' THEN 1 ELSE 0 END) AS completedGoals,
                CAST(CASE
                    WHEN COUNT(G.GoalID) = 0 THEN 0
                    ELSE (SUM(CASE WHEN G.Status = 'completed' THEN 1 ELSE 0 END) * 100.0 / COUNT(G.GoalID))
                END AS INT) AS progress,
                LOWER(F.Status) AS status
            FROM Features F
            LEFT JOIN Users U ON F.TLID = U.UserID
            LEFT JOIN Goals G ON F.FeatureID = G.FeatureID
            WHERE F.ProductID = @ProductID
            GROUP BY F.FeatureID, F.Name, F.Description, F.TLID, F.Deadline, U.FirstName, U.LastName, F.Status
            ORDER BY F.Deadline ASC
        `, { ProductID })

        const activities = await query(`
            SELECT TOP 10
                c.CommitID AS id,
                'commit' AS type,
                c.GitHubMessage AS message,
                u.Username AS author,
                CONVERT(VARCHAR, c.CreatedAt, 23) AS timestamp,
                c.CommitURL AS url
            FROM Commits c
            JOIN Goals g ON c.GoalID = g.GoalID
            JOIN Features f ON g.FeatureID = f.FeatureID
            JOIN Users u ON c.DevID = u.UserID
            WHERE f.ProductID = @ProductID
            ORDER BY c.CreatedAt DESC
        `, { ProductID })

        const response = {
            product: {
                id: productData.ProductID,
                name: productData.Name,
                description: productData.Description,
                deadline: productData.deadline,
                repository: {
                    name: `${productData.RepoOwner}/${productData.RepoName}`,
                    url: productData.RepoURL,
                    ...(repoStats ? {
                        stars: repoStats.stargazers_count,
                        forks: repoStats.forks_count,
                        watchers: repoStats.watchers_count,
                        lastUpdated: repoStats.updated_at
                    } : {})
                }
            },
            features: features,
            activities: activities,
        }
        console.log(response)

        return res.json({
            success: true,
            message: `Product channel ${productData.Name} details`,
            data: response
        })

    } catch (error: any) {
        console.error(error.message)
        return res.status(500).json({
            success: false,
            error: "Failed to fetch channel details",
            details: error.message
        })
    }
}

export default {
    createProductChannel,
    getChannelDetails,
    addFeature,
    deprecateChannel,
    updateFeatureDeadline,
    getChannelDeadline,
    getChannelGoals,
    getChannelMembers,
    getChannelReport,
    getFeatures,
    getTL
}
