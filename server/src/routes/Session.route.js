import express from "express";
import { getSessions } from "../controllers/Session.controller.js";
import { getSessionEvents } from "../controllers/Session.controller.js";

const router = express.Router();

router.route("/").get(getSessions);
router.route("/:sessionId/events").get(getSessionEvents);

export default router;