import { Router } from "express"
import Feature from "../handlers/features/feature.ts"

const router = Router()

router.post("/goal", Feature.createFeatureGoals as any)
router.post("/commit/:goalID", Feature.commitToGoal as any)
router.get("/", Feature.getFeatureChannel as any)
router.get("/members", Feature.getFeatureMembers as any)
router.get("/goals", Feature.getFeatureGoals as any)
router.patch("/commit/:goalID", Feature.updateCommit as any)
router.get("/commit", Feature.getCommit as any)
router.patch("/goal/:goalID", Feature.updateCommit as any)

export default router

