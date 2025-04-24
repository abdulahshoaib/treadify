import axios from "axios"
import type { Request, Response } from "express"
import { query } from "../../database/query.ts"

const createFeatureGoals = async (req: Request, res: Response) => {
    if (!req.session.User) {
        console.log("UnAuthorized")
        return res.status(401).json({ error: "Unauthorized Access" })
    }

    try {
        const FeatureID = req.session.User?.feature
        const CreatedByID = req.session.User?.id
        const { name, description, deadline } = req.body

        if (!FeatureID)
            return res.status(403).json({ error: "No feature assigned in session" })

        if (!name)
            return res.status(400).json({ error: "Goal name is required" })

        const result = await query(
            "INSERT INTO Goals (FeatureID, Name, Description, CreatedByID, Deadline) VALUES (@FeatureID, @Name, @Description, @CreatedByID, @Deadline)",
            { FeatureID, Name: name, Description: description, CreatedByID, Deadline: deadline }
        )

        return res.status(201).json({ message: `Created goal '${name}' for feature ${FeatureID}`, data: result })
    } catch (err: any) {
        console.error(err.message)
        return res.status(500).json({ error: err.message })
    }
}

const commitToGoal = async (req: Request, res: Response) => {
    if (!req.session.User)
        return res.status(401).json({ error: "Unauthorized Access" })

    try {
        const DevID = req.session.User?.id
        const { goalID } = req.params
        const { gitHubCommitSHA } = req.body;

        if (!DevID)
            return res.status(403).json({ error: "User must be logged in" })

        if (!gitHubCommitSHA)
            return res.status(400).json({ error: "GitHub commit SHA is required" });

        const existingCommit = await query(
            "SELECT 1 FROM Commits WHERE GoalID = @GoalID AND DevID = @DevID",
            { GoalID: goalID, DevID }
        )

        if (existingCommit.length)
            return res.status(409).json({ error: "A commit is already attached to this goal" })

        const userGitHub = await query(
            "SELECT GitHubUsername, AccessToken FROM UserGitHubIntegration WHERE UserID = @UserID",
            { UserID: DevID }
        )

        if (!userGitHub.length)
            return res.status(404).json({ error: "GitHub account not linked" })

        const { GitHubUsername, AccessToken } = userGitHub[0]

        const repoData = await query(
            `SELECT gr.RepoOwner, gr.RepoName
             FROM GitHubRepositories gr
             JOIN Products p ON gr.ProductID = p.ProductID
             JOIN Features f ON f.ProductID = p.ProductID
             JOIN Goals g ON g.FeatureID = f.FeatureID
             WHERE g.GoalID = @GoalID`,
            { GoalID: goalID }
        )

        if (!repoData.length)
            return res.status(404).json({ error: "No GitHub repo linked to goal" })

        const { RepoOwner, RepoName } = repoData[0]

        const commitResponse = await axios.get(
            `https://api.github.com/repos/${RepoOwner}/${RepoName}/commits/${gitHubCommitSHA}`,
            { headers: { Authorization: `Bearer ${AccessToken}` } }
        ).catch(() => null)

        if (!commitResponse)
            return res.status(404).json({ error: "Commit not found in the correct GitHub repository" })

        const { sha, commit, html_url } = commitResponse?.data

        await query(
            `INSERT INTO Commits (GoalID, DevID, GitHubCommitSHA, GitHubMessage, CommitURL)
             VALUES (@GoalID, @DevID, @GitHubCommitSHA, @GitHubMessage, @CommitURL)`,
            {
                GoalID: goalID,
                DevID,
                GitHubCommitSHA: sha,
                GitHubMessage: commit.message,
                CommitURL: html_url
            }
        )

        return res.json({ message: `Commit ${sha} added for goal ${goalID} by user ${DevID}, ${GitHubUsername}` })

    } catch (err: any) {
        console.error(err.message)
        return res.status(500).json({ error: err.message })
    }
}

const getFeatureChannel = async (req: Request, res: Response) => {
    if (!req.session.User)
        return res.status(401).json({ error: "Unauthorized Access" })

    try {
        const UserID = req.session.User.id
        const FeatureID = req.session.User.feature

        if (!FeatureID)
            return res.status(403).json({ error: "No feature assigned in session" })

        const featureInfo = await query(`
            SELECT
                f.FeatureID,
                f.Name AS FeatureName,
                f.Description AS FeatureDesc,
                CONVERT(VARCHAR, f.Deadline, 23) AS FeatureDeadline,
                p.ProductID,
                p.Name AS ProductName,
                p.Description AS ProductDesc,
                CONVERT(VARCHAR, p.Deadline, 23) AS ProductDeadline,
                gr.RepoOwner,
                gr.RepoName,
                gr.RepoURL
            FROM Features f
            JOIN Products p ON f.ProductID = p.ProductID
            LEFT JOIN GitHubRepositories gr ON p.ProductID = gr.ProductID
            WHERE f.FeatureID = @FeatureID AND f.TLID = @UserID
        `, { FeatureID, UserID })

        if (featureInfo.length === 0) {
            return res.status(404).json({ error: "Feature channel not found" })
        }

        const productData = featureInfo[0]

        const activeInvite = await query(`
            SELECT TOP 1 ci.Code
            FROM ChannelInvites ci
            JOIN Channels c ON ci.ChannelID = c.ChannelID
            WHERE c.ProductID = @ProductID
            ORDER BY ci.CreatedAt DESC
        `, { ProductID: req.session.User?.product })

        let repoStats = null
        if (productData.RepoURL) {
            try {
                repoStats = await axios.get(
                    `https://api.github.com/repos/${productData.RepoOwner}/${productData.RepoName}`,
                    {
                        headers: {
                            'Accept': 'application/vnd.github.v3+json'
                        }
                    }
                ).then(res => res.data)
                    .catch(err => {
                        console.error("GitHub API error:", err)
                        return null
                    })
            } catch (error) {
                console.error("Failed to fetch repository stats:", error)
            }
        }

        const goals = await query(`
            SELECT
                g.GoalID AS id,
                g.Name AS name,
                g.Description AS description,
                LOWER(g.Status) AS status,
                u.Username AS assignedTo,
                CONVERT(VARCHAR, g.Deadline, 23) AS deadline,
                ISNULL(
                    (SELECT COUNT(*) FROM Commits c WHERE c.GoalID = g.GoalID AND c.Status = 'accepted'), 0
                ) AS completedTasks,
                ISNULL(
                    (SELECT COUNT(*) FROM Commits c WHERE c.GoalID = g.GoalID), 0
                ) AS totalTasks,
                CAST(CASE
                    WHEN (SELECT COUNT(*) FROM Commits c WHERE c.GoalID = g.GoalID) = 0 THEN 0
                    ELSE ((SELECT COUNT(*) FROM Commits c WHERE c.GoalID = g.GoalID AND c.Status = 'accepted') * 100.0 /
                         (SELECT COUNT(*) FROM Commits c WHERE c.GoalID = g.GoalID))
                END AS INT) AS progress
            FROM Goals g
            LEFT JOIN Users u ON g.CreatedByID = u.UserID
            WHERE g.FeatureID = @FeatureID
            ORDER BY g.Deadline ASC
        `, { FeatureID })

        const activities = await query(`
            SELECT TOP 5
                c.CommitID AS id,
                'commit' AS type,
                c.GitHubMessage AS message,
                u.Username AS author,
                CONVERT(VARCHAR, c.CreatedAt, 23) AS timestamp,
                c.CommitURL AS url
            FROM Commits c
            JOIN Goals g ON c.GoalID = g.GoalID
            JOIN Users u ON c.DevID = u.UserID
            WHERE g.FeatureID = @FeatureID
            ORDER BY c.CreatedAt DESC
        `, { FeatureID })


        const response = {
            product: {
                id: productData.ProductID,
                name: productData.ProductName,
                description: productData.ProductDesc,
                deadline: productData.ProductDeadline,
                inviteCode: activeInvite[0]?.Code || "NOCODE",
                repository: {
                    name: `${productData.RepoOwner}/${productData.RepoName}`,
                    url: productData.RepoURL,
                    ...(repoStats ? {
                        stars: repoStats.stargazers_count,
                        forks: repoStats.forks_count,
                        watchers: repoStats.watchers_count,
                        lastUpdated: repoStats.updated_at
                    } : {
                        stars: 0,
                        forks: 0,
                        watchers: 0,
                        lastUpdated: new Date().toISOString()
                    })
                }
            },
            goals: goals.map(goal => ({
                ...goal,
                completedTasks: goal.completedTasks || 0,
                totalTasks: goal.totalTasks || 0,
                progress: goal.progress || 0
            })),
            activities: activities
        }

        return res.json({
            success: true,
            message: `Feature channel details for ${productData.FeatureName}`,
            data: response
        })

    } catch (err: any) {
        console.error(err.message)
        return res.status(500).json({
            success: false,
            error: "Failed to fetch feature channel details",
            details: err.message
        })
    }
}

const getFeatureMembers = async (req: Request, res: Response) => {
    if (!req.session.User)
        return res.status(401).json({ error: "Unauthorized Access" })

    try {
        const FeatureID = req.session.User?.feature

        if (!FeatureID)
            return res.status(403).json({ error: "No feature assigned in session" })

        const result = await query(
            `SELECT u.*
             FROM Users u
             JOIN ChannelMembers cm ON u.UserID = cm.UserID
             WHERE cm.FeatureID = @FeatureID`,
            { FeatureID }
        )

        return res.json({ message: `Members of feature ${FeatureID}`, data: result })
    } catch (err: any) {
        console.error(err.message)
        return res.status(500).json({ error: err.message })
    }
}

const getFeatureGoals = async (req: Request, res: Response) => {
    if (!req.session.User)
        return res.status(401).json({ error: "Unauthorized Access" })

    try {
        const FeatureID = req.session.User?.feature

        if (!FeatureID)
            return res.status(200).json({ error: "User is not part of any feature channel", data: [] })

        const result = await query(`
            SELECT
                g.GoalID as id,
                g.Name as GoalName,
                g.Description,
                CONVERT(VARCHAR(10), g.Deadline, 120) as Deadline,
                CONVERT(VARCHAR(10), g.CompletedAt, 120) as CompletedAt,
                g.Status,
                u.FirstName + ' ' + u.LastName as CreatedBy,
                f.Name as FeatureName
            FROM Goals g
            JOIN Users u ON g.CreatedByID = u.UserID
            JOIN Features f ON g.FeatureID = f.FeatureID
            WHERE g.FeatureID = @FeatureID
        `, { FeatureID })

        return res.json({
            data: result.map(goal => ({
                id: goal.id,
                GoalName: goal.GoalName,
                Description: goal.Description,
                Deadline: goal.Deadline,
                CompletedAt: goal.CompletedAt,
                Status: goal.Status,
                CreatedBy: goal.CreatedBy,
                FeatureName: goal.FeatureName,

            }))
        })
    } catch (err: any) {
        console.error(err.message)
        return res.status(500).json({ error: err.message })
    }
}

const updateCommit = async (req: Request, res: Response) => {
    if (!req.session.User)
        return res.status(401).json({ error: "Unauthorized Access" })

    try {
        const { commitID } = req.params
        const { status, comments } = req.body

        if (!status)
            return res.status(400).json({ error: "Status is required for update" })

        const result = await query(
            "UPDATE Commits SET Status = @Status, Comments = @Comments WHERE CommitID = @CommitID",
            { Status: status, Comments: comments, CommitID: commitID }
        )

        return res.json({ message: `Updated commit ${commitID} with status ${status}`, data: result })
    } catch (err: any) {
        console.error(err.message)
        return res.status(500).json({ error: err.message })
    }
}

const getCommit = async (req: Request, res: Response) => {
    if (!req.session.User) {
        return res.status(401).json({ error: "Unauthorized Access" });
    }

    try {
        const FeatureID = req.session.User?.feature;

        const result = await query(`
            SELECT
                c.CommitID,
                c.GitHubCommitSHA,
                c.GitHubMessage,
                c.CommitURL,
                c.CreatedAt AS submittedAt,
                c.Status,
                c.Comments AS feedback,
                g.GoalID,
                g.Name AS goalName,
                f.FeatureID,
                f.Name AS featureName,
                u.Username AS submittedBy
            FROM Commits c
            JOIN Goals g ON c.GoalID = g.GoalID
            JOIN Features f ON g.FeatureID = f.FeatureID
            JOIN Users u ON c.DevID = u.UserID
            WHERE f.FeatureID = @FeatureID;
        `, { FeatureID })

        const submissions = result.map((commit: any) => ({
            id: commit.CommitID.toString(),
            commitHash: commit.GitHubCommitSHA,
            commitMessage: commit.GitHubMessage,
            commitUrl: commit.CommitURL,
            submittedAt: commit.submittedAt.toISOString(), // Ensure date is in ISO string format
            status: commit.Status as "pending" | "accepted" | "rejected",
            feedback: commit.feedback,
            goalId: commit.GoalID.toString(),
            goalName: commit.goalName,
            featureId: commit.FeatureID.toString(),
            featureName: commit.featureName,
            submittedBy: commit.submittedBy
        }));

        return res.json(submissions);
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ error: "Server Error" });
    }
}

export default {
    createFeatureGoals,
    commitToGoal,
    getCommit,
    getFeatureChannel,
    getFeatureMembers,
    getFeatureGoals,
    updateCommit
}
