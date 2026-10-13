import express from "express";
import { createEvent, getPageClicks } from "../controllers/Event.controller.js";

const router = express.Router();

router.route("/").post(createEvent);
router.route("/clicks").get(getPageClicks);
export default router;