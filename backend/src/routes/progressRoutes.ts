import { Router } from "express";
import Progress from "../handlers/progress/progress.ts";

const router = Router();

router.get("/productchannel/progress", Progress.getProductProgress);
router.get("/featurechannel/progress", Progress.getFeatureProgress);
router.get("/feature/active", Progress.getActiveFeature);
router.get("/goal/status", Progress.getGoalStatus);
router.get("/commit/overview", Progress.getCommitOverview);
router.get("/featurechannel/commit/:goalid/status", Progress.getCommitStatus);

export default router;

