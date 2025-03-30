# Routes

## TODO

Implement the RBAC system to routes

## Auth

### [POST]  /auth/login
### [POST]  /auth/signup

## User Management

### [GET]   /user/:username/profile
### [PATCH] /user/:username/profile

## Product Management


### [POST]  /productchannel
*Create a new product channel*
    body: ProductName, ProductDisc, RepoURL
### [POST]  /productchannel/invite
*Create a new channel to add members*
### [POST]  /productchannel/features
*Create a new feature channel for the product channel*
    body: featureName, discription, technicalLeadID
### [PATCH] /productchannel/deprecate
*deprecate the channel*
### [PATCH] /productchannel/features/dealine
*Assign new deadline to feature*
    body: featureID and deadline
### [GET]   /productchannel/deadline
*Get product current deadline (based of last feature deadline)*
### [GET]   /productchannel/members
*Get all members of channel*
### [GET]   /productchannel/goals
*Get all product channel goals (completed and on going features)*
### [GET]   /productchannel/report
*Get a report for product channel based of current goal status of all products*

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
