![Treadify]("treadify-ascii-art.png")

# Table of Content

 1. [Key Features](#key-features)
 2. [User Types](#user-types)
 3. [User Permissions](#user-permissions)
    - [Product Manager](#product-manager)
    - [Technical Lead](#technical-lead)
    - [Developer](#developer)
 4. [Channels](#channels)
    - [Procduct Channels](#product-channels)
    - [Feature Chanels](#feature-channels)

# Key Features
 Deadlines:         A product deadlines are set based on the deadline of features
 Goals:             The progress is visually shown by goals assigned to teams
 Progress Reports:  Automated progress reports through the goals system. Explain how much of certian features has been developed

 *Github Integration

# User Types

 ## Product Manager (PM)
 - Product managers are responsible for the delivery of a product. They are the channel owners that can create channels and add members by join code.

 ## Technical Lead  (TL)
 - Work under the PM. Responsible for delivery of a feature assigned by the PM.

 ## Developers      (Dev)
 - Work under the TL. Resposible of working on features assigned to them.

# User Permissions

 ## Product Manager

 - Can create product channel
 - Product Manager can only have 1 channel at a time
 - Can send messages/files/photos to the product channel
 - Can mark a product as complete
 - Can depricate the product channel

 - Can create/update deadline for the delivery of a feature
 - Can create goals for different features of the product & assign a feature channel to it
 - Can assign TL to feature channels

 - Can generate join codes
 - Can generate progress report

 ## Technical Lead

 - Can send messages/files/photos to the product/feature channels
 - Can select the team of devs for the feature it was assigned
 - Can set goals for the feature team to achieve (Not dev specific)
 - Devs share their commits against goals, which the TL analyzes and either rejects or confirms
 - Goal once completed cannot be reopend
 - Progress bar increments once a goal is completed

 - Can add devs from the list of available devs from the product channel

 ## Developer

 - Can send messages/files/photos only to the feature channels
 - Can complete the goals given by the technical lead in the features group
 - Read messages from product channels; cannot send messages to the product channels

 ## Common User Permissions

 - Upload pictures
 - Set their view name
 - Reset their password
 - Reset their bio
 - cannot change username
 - *Link Github

# Channels

 ## Product Channels
 - Product channels focus on building product by assigning different features to different groups
 - Need to be setup by the Product Manager. PM makes feature channels that are assigned deadlines and the one with the last deadline is the deadline of the project
 - Dynamic report can be generated on the progress of each feature that also gives an overall view of the product's progress
 - Goals are setup automatically by creating new feature channels. The Goal is named after the feature channel
 - TL for the feature channel has to be unique and not already in another active feature channel

 ## Feature Channels
 - Feature channels focus on delivering features for the product
 - TL can only add devs from the product channel that are not already in any active feature channel
 - Goals are to be created by the Technical Leads
 - Devs can contribute to any goal based on their work
 - TL can reject or accept commits registered against goals
 - Once all the goals are achieved, the feature channel is made inactive and the goal is marked as complete in the product channel
