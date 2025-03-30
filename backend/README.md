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

- Feature ChannelID, Product ChannelID and UserID saved on authentication
- Feature ChannelID & Product ChannelID used to find unique ChannelID to apply operations

### [POST]   /messages/featurechannel
*Send message to feature channel of authenticated in user*
### [POST]   /messages/productchannel
*Send message to productchannel channel of authenticated in user*
### [GET]    /messages/featurechannel
*Get all messages of the featurechannel of authenticated user*
### [GET]    /messages/productchannel
*Get all messages of the productchannel of authenticated user*
### [DELETE] /messages/featurechannel
*Delete message from the featurechannel. MessageID passed in body*
### [DELETE] /messages/productchannel
*Delete message from the productchannel. MessageID passed in body*

## Misc

### [GET]   /user/permissions
### [GET]   /admin/stats
