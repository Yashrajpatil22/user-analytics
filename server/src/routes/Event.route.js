import express from "express";
import { createEvent, getPageClicks, getPageUrls } from "../controllers/Event.controller.js";

const router = express.Router();

router.route("/").post(createEvent);
router.route("/clicks").get(getPageClicks);
router.route("/pages").get(getPageUrls);
export default router;