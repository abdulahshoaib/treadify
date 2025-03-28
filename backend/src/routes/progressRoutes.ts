import { Router } from "express";
import Progress from "../handlers/progress/progress.ts";

const router = Router();

router.get("/productchannel/:channelID/progress", Progress.getProductProgress);
router.get("/featurechannel/:channelID/progress", Progress.getFeatureProgress);
router.get("/featurechannel/:channelID/commit/:goalid/status", Progress.getCommitStatus);
router.patch("/featurechannel/:channelID/commit/:goalid/status", Progress.updateCommitStatus);

export default router;

