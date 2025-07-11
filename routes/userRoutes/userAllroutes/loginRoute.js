import express from "express";
import { generateToken } from "../../../middleware/jwtMiddle.js";
import { loginController } from "../../../controllers/userController/userAllController.js";

const router = express.Router();
router.route("/").post(loginController, generateToken)

export const loginRoute = router;