import { Router } from "express";
import { checkAccountExist } from "../../../controllers/userController/userAllController.js";
import { sendOtpMiddleware } from "../../../middleware/userOtpmiddleware/OtpMiddleware.js";

const router = Router()
router.route("/").post(checkAccountExist, sendOtpMiddleware)

export const sendForgetOTPRoute = router;