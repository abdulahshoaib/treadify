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

- Feature Channel ID is present in the session cookie. User saves the featurechannelID it is in on signup
- User role is present in the session cookie. User saves the role it has on signup

### [POST]  /featurechannel/goal
*Create a new goal in the featurechannel*
### [POST]  /featurechannel/commit/:goalid
*Create a new commit against a goal in the featurechannel*
### [GET]   /featurechannel/
*Get all the information of the feature channel*
### [GET]   /featurechannel/members
*Get all the memebers of the feature channel*
### [GET]   /featurechannel/goals
*Get all the goals of the feature channel*
### [PATCH] /featurechannel/commit/:goalid
*Update the commit against some goal*
### [PATCH] /featurechannel/goal/:goalid
*Update the goal details*


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
