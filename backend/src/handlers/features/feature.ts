import axios from "axios"
import type { Request, Response } from "express"
import { query } from "../../database/query.ts"
import { hasPermission } from "../RABC.ts"

const createFeatureGoals = async (req: Request, res: Response) => {
    if (!req.session.User)
        return res.status(401).json({ error: "Unauthorized Access" })

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

// frontend api call to github to get the user all his commits and then send SHA here
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

    // no need for RBAC all users can get

    try {
        const FeatureID = req.session.User?.feature

        if (!FeatureID)
            return res.status(403).json({ error: "No feature assigned in session" })

        const result = await query("SELECT * FROM Features WHERE FeatureID = @FeatureID", { FeatureID })

        if (!result.length)
            return res.status(404).json({ error: "Feature channel not found" })

        return res.json({ message: `Feature channel details for ${FeatureID}`, data: result })
    } catch (err: any) {
        console.error(err.message)
        return res.status(500).json({ error: err.message })
    }
}

const getFeatureMembers = async (req: Request, res: Response) => {
    if (!req.session.User)
        return res.status(401).json({ error: "Unauthorized Access" })

    // no need for RBAC all users can get

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

export default {
    createFeatureGoals,
    commitToGoal,
    getFeatureChannel,
    getFeatureMembers,
    getFeatureGoals,
    updateCommit
}
