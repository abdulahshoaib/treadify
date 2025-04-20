import { getDashboard } from "../handlers/dashboards/dashboard.ts"
import { Router } from "express"

const router = Router()

router.get("/", getDashboard as any)

export default router
