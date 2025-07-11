import express from "express";
import { verifyToken } from "../../../middleware/jwtMiddle.js";
import { deleteMyLead } from "../../../controllers/leadController/leadAllController.js";
const router = express.Router();

router.route("/:id").delete(verifyToken, deleteMyLead)

export const deleteLead = router;