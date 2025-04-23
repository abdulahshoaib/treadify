import { Router } from "express"
import Progress from "../handlers/progress/progress.ts"

const router = Router()

router.get("/productchannel", Progress.getProductProgress as any)
router.get("/featurechannel/progress", Progress.getFeatureProgress as any)
router.get("/feature/active", Progress.getActiveFeature as any)
router.get("/goal/status", Progress.getGoalStatus as any)
router.get("/commit/overview", Progress.getCommitOverview as any)
router.get("/featurechannel/commit/:goalid/status", Progress.getCommitStatus as any)

export default router

