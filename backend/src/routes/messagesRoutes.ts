import { Router } from "express";
import Message from "../handlers/messages/messages.ts";

const router = Router();

router.post("/featurechannel", Message.sendFeatureMessage);
router.post("/productchannel", Message.sendProductMessage);
router.get("/featurechannel", Message.getFeatureMessages);
router.get("/productchannel", Message.getProductMessages);
router.delete("/featurechannel", Message.deleteFeatureMessage);
router.delete("/productchannel", Message.deleteProductMessage);

export default router;

