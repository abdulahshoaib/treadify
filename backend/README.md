# Routes

## Auth

### [POST]  /auth/login
### [POST]  /auth/signup

## User Management

### [GET]   /user/:username/profile
### [PATCH] /user/:username/profile

## Product Management

### [POST]  /productchannel
### [POST]  /productchannel/:channelID/invite
### [POST]  /productchannel/:channelID/features
### [PATCH] /productchannel/:channelID/deprecate
### [PATCH] /productchannel/:channelID/features/:featurechannel/tl
### [PATCH] /featurechannel/:channelID/features/:featurechannel/dealine
### [GET]   /productchannel/:channelID/deadline
### [GET]   /productchannel/:channelID/members
### [GET]   /productchannel/:channelID/goals
### [GET]   /productchannel/:channelID/deadline
### [GET]   /productchannel/:channelID/report

## Feature Management

### [POST]  /featurechannel/:channelID/goals
### [POST]  /featurechannel/:channelID/commit/:goalid
### [GET]   /featurechannel/:channelID/
### [GET]   /featurechannel/:channelID/members
### [GET]   /featurechannel/:channelID/goals
### [PATCH] /featurechannel/:channelID/commit/:goalid


## Progress & Reports

### [GET]   /productchannel/:channelID/progress
### [GET]   /featurechannel/:channelID/progress
### [GET]   /featurechannel/:channelID/commit/:goalid/status
### [PATCH] /featurechannel/:channelID/commit/:goalid/status

## Messages

### [POST]   /featurechannel/:channelID/messages
### [POST]   /productchannel/:channelID/messages
### [GET]    /featurechannel/:channelID/messages
### [GET]    /productchannel/:channelID/messages
### [DELETE] /featurechannel/:channelID/messages/:messageid
### [DELETE] /productchannel/:channelID/messages/:messageid

## Misc

### [GET]   /user/permissions
### [GET]   /admin/stats
