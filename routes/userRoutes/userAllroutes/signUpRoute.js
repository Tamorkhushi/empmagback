import express from "express";
import { verifyOtpMiddleware } from "../../../middleware/userOtpmiddleware/OtpMiddleware.js";
import { signUpController } from "../../../controllers/userController/userAllController.js";
import { generateToken } from "../../../middleware/jwtMiddle.js";
const router = express.Router();
router.route("/").post(verifyOtpMiddleware,signUpController, generateToken)

export const signUpRoute = router;