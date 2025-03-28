import { Router } from "express";
import { Auth } from "../handlers/auth/authpackage.ts"

const authRouter = Router();

authRouter.post("/signup", Auth.signup);
authRouter.post("/login", Auth.login);
authRouter.post("/logout", Auth.logout);

export default authRouter;

