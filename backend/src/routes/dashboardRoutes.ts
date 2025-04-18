import { dashboard } from "../handlers/dashboards/dashboard.ts"
import { Router } from "express"

const router = Router()

router.get("/:username", dashboard as any)

export default router
