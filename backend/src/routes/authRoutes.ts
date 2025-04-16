import { Router } from "express"
import { Auth } from "../handlers/auth/authpackage.ts"

const authRouter = Router();

authRouter.get("/checkUsername/:username", Auth.checkUsername);
authRouter.post("/signup", Auth.signup);
authRouter.post("/login", Auth.login);
authRouter.post("/logout", Auth.logout);
authRouter.get("/github", Auth.github.githubAuth);
authRouter.get("/github/callback", Auth.github.githubCallback);

export default authRouter;

