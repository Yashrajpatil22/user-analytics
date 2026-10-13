import express from "express";
import { createEvent } from "../controllers/Event.controller.js";

const router = express.Router();

router.route("/").post(createEvent);

export default router;