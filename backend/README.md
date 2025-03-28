# Routes

## Auth

### [POST]  /auth/login
### [POST]  /auth/signup

## User Management

### [GET]   /user/:username/profile
### [PATCH] /user/:username/profile

## Product Management

### [POST]  /productchannel
### [POST]  /productchannel/:channelname/invite
### [POST]  /productchannel/:channelname/features
### [PATCH] /productchannel/:channelname/depricate
### [PATCH] /productchannel/:channelname/features/:featurechannel/tl
### [PATCH] /featurechannel/:channelname/features/:featurechannel/dealine
### [GET]   /productchannel/:channelname/dealine
### [GET]   /productchannel/:channelname/members
### [GET]   /productchannel/:channelname/goals
### [GET]   /productchannel/:channelname/deadline
### [GET]   /productchannel/:channelname/report

## Feature Management

### [POST]  /featurechannel/:channelname/goals
### [POST]  /featurechannel/:channelname/commit/:goalid
### [GET]   /featurechannel/:channelname/
### [GET]   /featurechannel/:channelname/members
### [GET]   /featurechannel/:channelname/goals
### [PATCH] /featurechannel/:channelname/commit/:goalid


## Progress & Reports

### [GET]   /productchannel/:channelname/progress
### [GET]   /featurechannel/:channelname/progress
### [GET]   /featurechannel/:channelname/commit/:goalid/status
### [PATCH] /featurechannel/:channelname/commit/:goalid/status

## Messages

### [POST]   /featurechannel/:channelname/messages
### [POST]   /productchannel/:channelname/messages
### [GET]    /featurechannel/:channelname/messages
### [GET]    /productchannel/:channelname/messages
### [DELETE] /featurechannel/:channelname/messages/:messageid
### [DELETE] /productchannel/:channelname/messages/:messageid

## Misc

### [GET]   /user/permissions
### [GET]   /admin/stats
