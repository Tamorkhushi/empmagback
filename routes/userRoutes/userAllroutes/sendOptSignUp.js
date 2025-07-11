import express from "express";
import { checkAccountExist } from "../../../controllers/userController/userAllController.js";
import { sendOtpMiddleware } from "../../../middleware/userOtpmiddleware/OtpMiddleware.js";
const router = express.Router();
// Define the route
router.route("/").post(checkAccountExist, sendOtpMiddleware);

export const sendOptSignUp = router;

