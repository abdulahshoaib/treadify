import { Router } from "express";
import Profile from "../handlers/profile/profile.ts";

const router = Router();

router.get("/:username/profile", Profile.getUserProfile);
router.patch("/:username/profile", Profile.updateUserProfile);

export default router;

