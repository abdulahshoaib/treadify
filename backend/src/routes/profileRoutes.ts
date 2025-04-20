import { Router } from "express";
import Profile from "../handlers/profile/profile.ts";

const router = Router();

router.get("/repos", Profile.getUserRepos as any);
router.get("/profile", Profile.getUserProfile as any);
router.patch("/profile", Profile.updateUserProfile as any);

export default router;

