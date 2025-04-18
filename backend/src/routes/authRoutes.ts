import { Router } from "express"
import { Auth } from "../handlers/auth/authpackage.ts"

const authRouter = Router()

authRouter.get("/checkUsername/:username", Auth.checkUsername as any)
authRouter.post("/signup", Auth.signup as any)
authRouter.post("/login", Auth.login as any)
authRouter.post("/logout", Auth.logout as any)
authRouter.post("/validateCode", Auth.validateCode as any)
authRouter.post("/generateCode", Auth.generateCode as any)
authRouter.get("/github", Auth.github.githubAuth as any)
authRouter.get("/github/callback", Auth.github.githubCallback as any)

export default authRouter

