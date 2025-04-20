# API Routes Documentation

## Table of Contents
- [Authentication](#authentication)
- [User Management](#user-management)
- [Product Management](#product-management)
- [Feature Management](#feature-management)
- [Messages](#messages)
- [Progress Tracking](#progress-tracking)
- [User Profile](#user-profile)
- [GitHub Integration](#github-integration)
- [Miscellaneous](#miscellaneous)

## Authentication

### `POST` /auth/login
Authenticate a user and create a session.

**Request Body:**
```json
{
  "username": "string",
  "pass": "string"
}
```

**Response (200):**
```json
{
  "message": "Login Successful"
}
```

**Error Responses:**
- `400` - Invalid Input
- `401` - No User Found
- `401` - Invalid Password
- `500` - Session Error
- `500` - Internal Server Error

**Notes:**
- Creates a session with user details including ID, username, email, product, feature, and role
- Session cookie is set and used for subsequent authenticated requests

---

### `POST` /auth/signup
Register a new user account.

**Request Body:**
```json
{
  "FirstName": "string",
  "LastName": "string",
  "username": "string",
  "email": "string",
  "pass": "string"
}
```

**Response (201):**
```json
{
  "message": "User Created"
}
```

**Error Responses:**
- `400` - Invalid Input
- `500` - Internal Server Error

**Notes:**
- Password is hashed with bcrypt before storing in the database

---

### `GET` /auth/checkUsername/:username
Check if a username is available.

**Response (200):**
```json
{
  "available": "true"
}
```
or
```json
{
  "available": "false"
}
```

**Error Responses:**
- `400` - Invalid Input
- `500` - Internal Server error

---

### `POST` /auth/logout
Ends the current user session.

**Response (200):**
```json
{
  "message": "Logout successful"
}
```

**Error Responses:**
- `400` - No active session
- `500` - Could not log out
- `500` - Internal server error

**Notes:**
- Destroys the session and clears the session cookie

## User Management

### `GET` /user/:username/profile
Retrieve profile information for a specific user.

---

### `PATCH` /user/:username/profile
Update profile information for a specific user.

## GitHub Integration

### `GET` /auth/github
Initiates GitHub OAuth flow for linking GitHub account.

**Authentication Required:** Yes

**Response:**
- Redirects to GitHub authorization page

**Error Responses:**
- `401` - Unauthorized Access

---

### `GET` /auth/github/callback
Callback endpoint for GitHub OAuth process.

**Query Parameters:**
- `code` - OAuth code from GitHub

**Response (200):**
```json
{
  "message": "GitHub linked successfully",
  "GitHubUsername": "string"
}
```

**Error Responses:**
- `400` - Missing GitHub code
- `400` - Failed to get GitHub access token
- `401` - Unauthorized Access
- `500` - GitHub authentication failed

**Notes:**
- Links GitHub account to user's profile
- Stores GitHub username and access token

## Feature Management

> **Note:**
> - Feature Channel ID is present in the session cookie (saved on login)
> - User role is present in the session cookie (saved on login)

### `POST` /featurechannel/goal
Create a new goal in the feature channel.

**Authentication Required:** Yes

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "deadline": "datetime"
}
```

**Response (201):**
```json
{
  "message": "Created goal '[name]' for feature [FeatureID]",
  "data": { /* Result object */ }
}
```

**Error Responses:**
- `400` - Goal name is required
- `401` - Unauthorized Access
- `403` - No feature assigned in session
- `500` - [Error message]

---

### `POST` /featurechannel/commit/:goalid
Create a new commit against a goal in the feature channel.

**Authentication Required:** Yes

**URL Parameters:**
- `goalid` - Number, the ID of the goal

**Request Body:**
```json
{
  "gitHubCommitSHA": "string"
}
```

**Response (200):**
```json
{
  "message": "Commit [sha] added for goal [goalID] by user [DevID], [GitHubUsername]"
}
```

**Error Responses:**
- `400` - GitHub commit SHA is required
- `401` - Unauthorized Access
- `403` - User must be logged in
- `404` - GitHub account not linked
- `404` - No GitHub repo linked to goal
- `404` - Commit not found in the correct GitHub repository
- `409` - A commit is already attached to this goal
- `500` - [Error message]

**Notes:**
- Verifies GitHub integration for the user
- Validates commit exists in the relevant repository
- Stores commit message and URL

---

### `GET` /featurechannel/
Get all the information of the feature channel.

**Authentication Required:** Yes

**Response (200):**
```json
{
  "message": "Feature channel details for [FeatureID]",
  "data": [ /* Feature channel details */ ]
}
```

**Error Responses:**
- `401` - Unauthorized Access
- `403` - No feature assigned in session
- `404` - Feature channel not found
- `500` - [Error message]

---

### `GET` /featurechannel/members
Get all the members of the feature channel.

**Authentication Required:** Yes

**Response (200):**
```json
{
  "message": "Members of feature [FeatureID]",
  "data": [ /* User details */ ]
}
```

**Error Responses:**
- `401` - Unauthorized Access
- `403` - No feature assigned in session
- `500` - [Error message]

---

### `GET` /featurechannel/goals
Get all the goals of the feature channel.

**Authentication Required:** Yes

**Response (200):**
```json
{
  "message": "Goals for feature [FeatureID]",
  "data": [ /* Goal details */ ]
}
```

**Error Responses:**
- `401` - Unauthorized Access
- `403` - No feature assigned in session
- `500` - [Error message]

---

### `PATCH` /featurechannel/commit/:commitID
Update the commit against some goal.

**Authentication Required:** Yes

**URL Parameters:**
- `commitID` - Number, the ID of the commit

**Request Body:**
```json
{
  "status": "string",
  "comments": "string"
}
```

**Response (200):**
```json
{
  "message": "Updated commit [commitID] with status [status]",
  "data": { /* Result object */ }
}
```

**Error Responses:**
- `400` - Status is required for update
- `401` - Unauthorized Access
- `500` - [Error message]

## Product Management

### `POST` /productchannel
Create a new product channel with GitHub repository integration.

**Authentication Required:** Yes (PM role expected)

**Request Body:**
```json
{
  "Name": "string (required)",
  "Description": "string (required)",
  "RepoURL": "string (required, format: https://github.com/{owner}/{repo})"
}
```

**Response (201):**
```json
{
  "message": "Created product: {Name} with GitHub repo",
  "ProductID": "number"
}
```

**Error Responses:**
- `400` - Missing required fields or invalid GitHub URL format
- `401` - Unauthorized Access
- `403` - No role assigned
- `403` - Insufficent Permissions
- `404` - GitHub account not connected
- `500` - GitHub API error or database transaction failure

**Implementation Details:**
- Creates a new product with 60-day default deadline
- Verifies GitHub repository exists and is accessible
- Stores repository metadata (owner, name, default branch)
- Uses database transaction for atomic operations

---

### `POST` /productchannel/features
Add a new feature to the product channel.

**Authentication Required:** Yes

**Request Body:**
```json
{
  "featureName": "string (required)",
  "description": "string (required)",
  "TLID": "number (Technical Lead ID)"
}
```

**Response (201):**
```json
{
  "message": "Feature {featureName} added to channel",
  "data": "object (database result)"
}
```

**Error Responses:**
- `400` - Missing required fields
- `401` - Unauthorized Access
- `403` - No role assigned
- `403` - Insufficent Permissions
- `404` - Product channel not found
- `500` - Database error

---

### `PATCH` /productchannel/deprecate
Deprecate the product channel.

**Authentication Required:** Yes

**Response (200):**
```json
{
  "message": "Channel {ProductID} has been deprecated",
  "data": "object (database result)"
}
```

**Error Responses:**
- `401` - Unauthorized Access
- `403` - No role assigned
- `403` - Insufficent Permissions
- `500` - Database error

---

### `PATCH` /productchannel/features/deadline
Update feature deadline.

**Authentication Required:** Yes

**Request Body:**
```json
{
  "featureID": "number (required)",
  "deadline": "ISO datetime string (required)"
}
```

**Response (200):**
```json
{
  "message": "Feature {featureID} deadline updated",
  "data": "object (database result)"
}
```

**Error Responses:**
- `400` - Missing required fields
- `401` - Unauthorized Access
- `403` - No role assigned
- `403` - Insufficent Permissions
- `500` - Database error

---

### `GET` /productchannel/deadline
Get product channel deadline.

**Authentication Required:** Yes

**Response (200):**
```json
{
  "message": "Deadline for channel {ProductID}",
  "data": {
    "Deadline": "ISO datetime string"
  }
}
```

**Error Responses:**
- `401` - Unauthorized Access
- `404` - Channel not found
- `500` - Database error

---

### `GET` /productchannel/members
Get all members of the product channel.

**Authentication Required:** Yes

**Response (200):**
```json
{
  "message": "Members of channel {ProductID}",
  "data": [
    {
      "UserID": "number",
      "Username": "string",
      "Email": "string",
      // ... other user fields
    }
  ]
}
```

**Error Responses:**
- `401` - Unauthorized Access
- `500` - Database error

---

### `GET` /productchannel/goals
Get all features (goals) for the product channel.

**Authentication Required:** Yes

**Response (200):**
```json
{
  "message": "Goals for channel {ProductID}",
  "data": [
    {
      "FeatureID": "number",
      "Name": "string"
    }
  ]
}
```

**Error Responses:**
- `401` - Unauthorized Access
- `500` - Database error

---

### `GET` /productchannel/report
Get product channel report with statistics.

**Authentication Required:** Yes

**Response (200):**
```json
{
  "message": "Report for channel {ProductID}",
  "data": {
    "ProductName": "string",
    "TotalMembers": "number",
    "TotalFeatures": "number",
    "TotalGoals": "number"
  }
}
```

**Error Responses:**
- `401` - Unauthorized Access
- `404` - Channel not found
- `500` - Database error

Here's the updated **Messages** section of your documentation, refined based on the actual implementation:

---

## Messages

### Channel Structure
- Product channels: `ProductID` only (FeatureID = NULL)
- Feature channels: Both `ProductID` and `FeatureID`

### `POST` /messages/featurechannel
Send message to feature channel.

**Authentication Required:** Yes
**Session Requirements:**
- `User.id`
- `User.product`
- `User.feature`

**Request Body:**
```json
{
  "message": "string (required, max 2000 chars)"
}
```

**Response (201):**
```json
{
  "message": "Message sent in feature channel",
  "data": {
    "insertId": "number",
    "affectedRows": 1
  }
}
```

**Error Responses:**
- `400` - Missing FeatureID, UserID, or message content
- `401` - Unauthorized (no active session)
- `404` - Feature channel not found
- `500` - Database error

---

### `POST` /messages/productchannel
Send message to product channel.

**Authentication Required:** Yes
**Session Requirements:**
- `User.id`
- `User.product`

**Request Body:** Same as feature channel

**Response (201):**
```json
{
  "message": "Message sent in Product channel",
  "data": { /* same structure as feature channel */ }
}
```

**Error Responses:** Same as feature channel

---

### `GET` /messages/featurechannel
Get all messages from feature channel (newest first).

**Authentication Required:** Yes
**Session Requirements:**
- `User.product`
- `User.feature`

**Response (200):**
```json
{
  "message": "Messages for feature {FeatureID}",
  "data": [
    {
      "MessageID": "number",
      "ChannelID": "number",
      "SenderID": "number",
      "Content": "string",
      "CreatedAt": "ISO datetime string"
    }
  ]
}
```

**Error Responses:**
- `401` - Unauthorized
- `404` - Channel not found
- `500` - Database error

---

### `GET` /messages/productchannel
Get all product channel messages.

**Authentication Required:** Yes
**Session Requirements:**
- `User.product`

**Response:** Same structure as feature channel messages

---

### `DELETE` /messages/featurechannel
Delete user's own message from feature channel.

**Authentication Required:** Yes
**Session Requirements:**
- `User.id`
- `User.product`
- `User.feature`

**Request Body:**
```json
{
  "MessageID": "number (required)"
}
```

**Response (200):**
```json
{
  "message": "Deleted feature message {MessageID}",
  "data": {
    "affectedRows": 1
  }
}
```

**Error Responses:**
- `400` - Missing MessageID
- `401` - Unauthorized
- `404` - Message not found or not owned by user
- `500` - Database error

**Note:** Only the original sender can delete messages

---

### `DELETE` /messages/productchannel
Delete product channel message.

**Authentication Required:** Yes
**Request/Response:** Same as feature channel deletion

---

## Progress Tracking

### `GET` /progress/product
Get progress metrics for the current user's product.

**Authentication Required:** Yes
**Session Requirements:**
- `ProductID` must be present in user session

**Response (200):**
```json
{
  "message": "Progress for product {ProductID}",
  "data": {
    "ProductID": "number",
    "ProductName": "string",
    "TotalFeatures": "number",
    "CompletedFeatures": "number",
    "ProgressPercentage": "number"
  }
}
```

**Error Responses:**
- `400` - Product ID missing in session
- `403` - No role assigned
- `403` - Insufficent Permissions
- `404` - No progress data found
- `500` - Database error

---

### `GET` /progress/feature
Get progress metrics for the current user's feature.

**Authentication Required:** Yes
**Session Requirements:**
- `FeatureID` must be present in user session

**Response (200):**
```json
{
  "message": "Progress for feature {FeatureID}",
  "data": {
    "FeatureID": "number",
    "FeatureName": "string",
    "TotalGoals": "number",
    "CompletedGoals": "number",
    "ProgressPercentage": "number"
  }
}
```

**Error Responses:**
- `400` - Feature ID missing in session
- `403` - No role assigned
- `403` - Insufficent Permissions
- `404` - No progress data found
- `500` - Database error

---

### `GET` /progress/commit/:goalID
Get commit status for a specific goal.

**Authentication Required:** Yes

**URL Parameters:**
- `goalID` (required) - Target goal ID

**Response (200):**
```json
{
  "message": "Commit status for goal {goalID}",
  "data": {
    "Status": "string (pending/approved/rejected)"
  }
}
```

**Error Responses:**
- `400` - Missing goal ID
- `403` - No role assigned
- `403` - Insufficent Permissions
- `404` - No commit found
- `500` - Database error

**Notes:**
- Used to check review status of GitHub commits linked to goals

---

### `GET` /progress/goal-status
Get goal status for the current user's feature.

**Authentication Required:** Yes
**Session Requirements:**
- `FeatureID` must be present in user session

**Response (200):**
```json
{
  "message": "Feature Overview",
  "data": [
    {
      "GoalID": "number",
      "GoalName": "string",
      "Status": "string"
    }
  ]
}
```

**Error Responses:**
- `400` - Feature ID missing in session
- `403` - No role assigned
- `403` - Insufficient Permissions
- `404` - No data found
- `500` - Database error

---

### `GET` /progress/commit-overview
Get commit overview for the current user's feature.

**Authentication Required:** Yes
**Session Requirements:**
- `FeatureID` must be present in user session

**Response (200):**
```json
{
  "message": "Feature Overview",
  "data": [
    {
      "CommitID": "number",
      "CommitMessage": "string",
      "Status": "string"
    }
  ]
}
```

**Error Responses:**
- `400` - Feature ID missing in session
- `403` - No role assigned
- `403` - Insufficient Permissions
- `404` - No data found
- `500` - Database error

---

## User Profile

### `GET` /user/profile
Get the authenticated user's profile information.

**Authentication Required:** Yes
**Session Requirements:**
- `User.id` must be present in session

**Response (200):**
```json
{
  "message": "User profile for {UserID}",
  "data": {
    "UserID": "number",
    "Username": "string",
    "Email": "string",
    "ProfileImgPath": "string | null",
    "GitHubUsername": "string | null",
    "Role": "string",
    "CreatedAt": "ISO datetime string"
  }
}
```

**Error Responses:**
- `400` - Missing user ID in session
- `404` - User not found
- `500` - Database error

---

### `PATCH` /user/profile
Update the authenticated user's profile information.

**Authentication Required:** Yes
**Session Requirements:**
- `User.id` must be present in session

**Request Body:**
```json
{
  "Email": "string",
  "ProfileImgPath": "string"
}
```

**Response (200):**
```json
{
  "message": "User profile updated for {UserID}",
  "data": {
    "affectedRows": 1
  }
}
```

**Error Responses:**
- `400` - Missing required fields
- `401` - Unauthorized
- `500` - Database error

**Notes:**
1. Only email and profile image path can be updated
2. Profile images should be uploaded separately (via different endpoint)
3. Returns the raw database update result

---

## Miscellaneous

### `GET` /user/permissions
Get current user's permissions.

---

### `GET` /admin/stats
Get admin statistics (admin-only).

## Database Schema

- **Users** - Stores user credentials and profile information
- **ChannelMembers** - Maps users to product and feature channels
- **Features** - Stores feature channel details
- **Products** - Stores product channel details
- **Goals** - Stores goals associated with features
- **Commits** - Stores GitHub commit information linked to goals
- **UserGitHubIntegration** - Links users to their GitHub accounts
- **GitHubRepositories** - Stores repository information for products
- **Roles** - Defines user roles in the system
- **UserRoles** - Maps users to their roles

## Authentication Flow

1. User signs up with username, email, and password
2. User logs in with username and password
3. Session is created with user details
4. User can optionally link their GitHub account
5. Session is used for all authenticated requests

## GitHub Integration Flow

1. User initiates GitHub OAuth process
2. User authorizes application on GitHub
3. Application receives OAuth code and exchanges it for access token
4. User's GitHub account is linked to their profile
5. User can then link commits to goals in feature channels

## TODO
Add 2 routes /auth/generateCode & /auth/validateCode
Add documentation for route /user/:username/repos
