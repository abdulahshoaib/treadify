import { Router } from "express";
import Message from "../handlers/messages/messages.ts";

const router = Router();

router.post("/featurechannel/:channelID/messages", Message.sendFeatureMessage);
router.post("/productchannel/:channelID/messages", Message.sendProductMessage);
router.get("/featurechannel/:channelID/messages", Message.getFeatureMessages);
router.get("/productchannel/:channelID/messages", Message.getProductMessages);
router.delete("/featurechannel/:channelID/messages/:messageid", Message.deleteFeatureMessage);
router.delete("/productchannel/:channelID/messages/:messageid", Message.deleteProductMessage);

export default router;

