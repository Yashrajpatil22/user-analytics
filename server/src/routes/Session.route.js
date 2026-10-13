import express from "express";
import { getSessions } from "../controllers/Session.controller.js";

const router = express.Router();

router.route("/").get(getSessions);

export default router;