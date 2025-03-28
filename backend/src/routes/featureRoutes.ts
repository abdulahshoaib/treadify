import { Router } from "express";
import Feature from "../handlers/features/feature.ts";

const router = Router();

router.post("/:channelID/goals", Feature.createFeatureGoals);
router.post("/:channelID/commit/:goalID", Feature.commitToGoal);
router.get("/:channelID/", Feature.getFeatureChannel);
router.get("/:channelID/members", Feature.getFeatureMembers);
router.get("/:channelID/goals", Feature.getFeatureGoals);
router.patch("/:channelID/commit/:goalID", Feature.updateCommit);

export default router;

