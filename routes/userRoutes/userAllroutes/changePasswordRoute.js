import express from "express";
import { verifyOtpMiddleware } from "../../../middleware/userOtpmiddleware/OtpMiddleware.js";
import { generateToken } from "../../../middleware/jwtMiddle.js";
import { passwordChangeController } from "../../../controllers/userController/userAllController.js";

const router = express.Router();
router.route("/")
    .patch(verifyOtpMiddleware,passwordChangeController,generateToken)

export const passwordChangeRoute = router;