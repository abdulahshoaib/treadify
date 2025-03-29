import { Router } from "express";
import Feature from "../handlers/features/feature.ts";

const router = Router();

router.post("/goal", Feature.createFeatureGoals);
router.post("/commit/:goalID", Feature.commitToGoal);
router.get("/", Feature.getFeatureChannel);
router.get("/members", Feature.getFeatureMembers);
router.get("/goals", Feature.getFeatureGoals);
router.patch("/commit/:goalID", Feature.updateCommit);
router.patch("/goal/:goalID", Feature.updateCommit);

export default router;

