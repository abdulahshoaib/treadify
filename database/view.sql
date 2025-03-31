CREATE VIEW RolePermissionsView AS
SELECT
    R.Name AS RoleName,
    P.Name AS PermissionName,
    P.Description AS PermissionDescription
FROM Roles R
JOIN RolePermissions RP ON R.RoleID = RP.RoleID
JOIN Permissions P ON RP.PermissionID = P.PermissionID;

CREATE VIEW FeatureOverviewView AS
SELECT
    F.FeatureID,
    F.Name AS FeatureName,
    F.Description AS FeatureDescription,
    F.Status AS FeatureStatus,
    P.Name AS ProductName,
    F.Deadline AS FeatureDeadline,
    U.Username AS TLUsername
FROM Features F
JOIN Products P ON F.ProductID = P.ProductID
JOIN Users U ON F.TLID = U.UserID
WHERE F.Status = 'active'

CREATE VIEW GoalStatusView AS
SELECT
    G.GoalID,
    G.Name AS GoalName,
    G.Status AS GoalStatus,
    G.Deadline,
    CASE
        WHEN G.CompletedAt IS NOT NULL THEN 'Completed'
        WHEN G.Deadline < GETDATE() AND G.Status = 'open' THEN 'Overdue'
        ELSE 'Open'
    END AS ActualStatus,
    U.Username AS CreatedBy
FROM Goals G
JOIN Users U ON G.CreatedByID = U.UserID

CREATE VIEW CommitOverviewView AS
SELECT
    C.CommitID,
    C.GitHubCommitSHA,
    C.GitHubMessage,
    C.Status AS CommitStatus,
    C.CreatedAt AS CommitCreatedAt,
    G.Name AS GoalName,
    G.Status AS GoalStatus,
    U.Username AS Developer,
    CU.Username AS Reviewer
FROM Commits C
JOIN Goals G ON C.GoalID = G.GoalID
JOIN Users U ON C.DevID = U.UserID
LEFT JOIN Users CU ON C.ReviewedByID = CU.UserID
