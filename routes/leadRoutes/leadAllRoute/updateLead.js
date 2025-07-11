import express from "express";
import { verifyToken } from "../../../middleware/jwtMiddle.js";
import { deleteMyLead, updateMyLead } from "../../../controllers/leadController/leadAllController.js";
const router = express.Router();

router.route("/:id").patch(verifyToken, updateMyLead)

export const updateLead = router;

