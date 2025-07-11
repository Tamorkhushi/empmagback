import express from "express";
import { verifyToken } from "../../../middleware/jwtMiddle.js";
import { getMyLeads } from "../../../controllers/leadController/leadAllController.js";

const router = express.Router();
router.route("/").get(verifyToken, getMyLeads)

export const getLeads = router;