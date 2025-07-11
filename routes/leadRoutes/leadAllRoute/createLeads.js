import express from "express";
import { createMyLead } from "../../../controllers/leadController/leadAllController.js";
import { verifyToken } from "../../../middleware/jwtMiddle.js";
const router = express.Router();

router.route("/").post(verifyToken, createMyLead)

export const createLeads = router;