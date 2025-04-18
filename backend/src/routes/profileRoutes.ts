import { Router } from "express";
import Profile from "../handlers/profile/profile.ts";

const router = Router();

router.get("/:username/profile", Profile.getUserProfile as any);
router.patch("/:username/profile", Profile.updateUserProfile as any);

export default router;

