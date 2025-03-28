import { Router } from "express";
import Product from "../handlers/product/product.ts";

const router = Router();

router.post("/", Product.createProductChannel);
router.post("/:channelID/invite", Product.inviteToChannel);
router.post("/:channelID/features", Product.addFeature);
router.patch("/:channelID/deprecate", Product.deprecateChannel);
router.patch("/:channelID/features/:featurechannel/tl", Product.updateFeatureTL);
router.patch("/:channelID/features/:featurechannel/deadline", Product.updateFeatureDeadline);
router.get("/:channelID/deadline", Product.getChannelDeadline);
router.get("/:channelID/members", Product.getChannelMembers);
router.get("/:channelID/goals", Product.getChannelGoals);
router.get("/:channelID/report", Product.getChannelReport);

export default router;

