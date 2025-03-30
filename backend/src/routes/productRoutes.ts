import { Router } from "express";
import Product from "../handlers/product/product.ts";

const router = Router();

router.post("/", Product.createProductChannel);
router.post("/invite", Product.inviteToChannel);
router.post("/features", Product.addFeature);
router.patch("/deprecate", Product.deprecateChannel);
router.patch("/features/deadline", Product.updateFeatureDeadline);
router.get("/deadline", Product.getChannelDeadline);
router.get("/members", Product.getChannelMembers);
router.get("/goals", Product.getChannelGoals);
router.get("/report", Product.getChannelReport);

export default router;

