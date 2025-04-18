import { Router } from "express";
import Product from "../handlers/product/product.ts";

const router = Router();

router.post("/", Product.createProductChannel as any);
router.post("/features", Product.addFeature as any);
router.patch("/deprecate", Product.deprecateChannel as any);
router.patch("/features/deadline", Product.updateFeatureDeadline as any);
router.get("/deadline", Product.getChannelDeadline as any);
router.get("/members", Product.getChannelMembers as any);
router.get("/goals", Product.getChannelGoals as any);
router.get("/report", Product.getChannelReport as any);

export default router;
