import express from "express";
import { sendOptSignUp } from "./userAllroutes/sendOptSignUp.js";
import { signUpRoute } from "./userAllroutes/signUpRoute.js";
import { loginRoute } from "./userAllroutes/loginRoute.js";
import { sendForgetOTPRoute } from "./userAllroutes/forgetpasswordRoute.js";
import { passwordChangeRoute } from "./userAllroutes/changePasswordRoute.js";
// router
const router = express.Router();

// signup login
router.use("/send_signup_otp", sendOptSignUp);
router.use("/signup", signUpRoute);
router.use("/login", loginRoute)

// change password
router.use("/send_forgot_password_otp", sendForgetOTPRoute)
router.use("/change_password", passwordChangeRoute)


export const userRoute = router;
