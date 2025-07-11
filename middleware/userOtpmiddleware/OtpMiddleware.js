import otpModel from "../../models/userModels/otpModel.js";
import { sendOtp, verifyOtp } from "../../services/library/otpless.js";
import { StatusCodes } from "http-status-codes";
import {
  SendOtpValidator,
  VerifyOtpValidator,
} from "../../schema_validation/userData/login_signupvalidate.js";
import logger from "../../logger.js";
import sendOTPOnEmail from "../../services/library/mailOTP.js";

export const sendOtpMiddleware = async (req, res) => {
  try {
    const { email, phoneNumber } = req.body;

    console.log("heloo rohit form sendOtpMiddleware", req.body);

    if (!email && !phoneNumber) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Email or phone number is required.",
        });
    }

    console.log(
      "sendOtpMiddleware before sendotp validator",
      phoneNumber,
      email
    );

    const hello = await SendOtpValidator.validateAsync({ phoneNumber, email });

    console.log("after validate", hello, "==>", phoneNumber, email);

    let mailOtp, result;

    if (email) {
      mailOtp = Math.floor(1000 + Math.random() * 9000);
      console.log("in mail block", email);

      result = await sendOTPOnEmail({
        to: email,
        subject: "Verify Your Email Account",
        html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>User OTP Verification</h2>
      <p>Your OTP for verification: <strong>${mailOtp}</strong></p>
      <p>Valid for 10 minutes.</p>
      </div>
      `,
      });
    }

    console.log(
      "after email checking in sendOtpMiddleware",
      phoneNumber,
      email
    );

    if (phoneNumber) {
      result = await sendOtp(phoneNumber, "WHATSAPP");
    }

    console.log("before success in sendOtpMiddleware", phoneNumber, email);

    if (result?.success) {
      logger.info("OTP sent successfully...");
      const otpID = result?.message?.startsWith("Otp")
        ? result?.message
        : false;

      if (mailOtp && email) {
        let expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10);

        if (await otpModel.findOne({ email })) {
          await otpModel.findOneAndUpdate({ email }, { mailOtp, expiresAt });
        } else {
          await otpModel.create({ email, mailOtp, expiresAt });
        }
      }

      return res.status(200).json({
        success: true,
        message: "OTP sent successfully",
        // otpID: result?.message?.startsWith("Otp") ? result?.message : null,
        data: { otpID },
      });
    } else {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "OTP not generated" });
    }
  } catch (error) {
    // logger.error(`Error sending OTP: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Error sending OTP",
      error: error.message,
    });
  }
};

export const verifyOtpMiddleware = async (req, res, next) => {
  try {
    logger.info("for otp varification ");
    console.log("for varification", req.body);

    const phoneNumber = req.body?.phoneNumber;
    const email = req.body?.email;
    const otp = req.body?.otp;
    const otpID = req.body?.otpID;

    if (!phoneNumber && !email && !otp) {
      console.log("after check", req.body);
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "all data like email or phoneNumber and OTP is required",
        data: {},
      });
    }
    console.log("after check", req.body);
    console.log("after check", otpID);

    await VerifyOtpValidator.validateAsync({ phoneNumber, email, otp, otpID });
    let result;

    //// for using email time
    if (email) {
      const data = await otpModel.findOne({ email }, { mailOtp: 1 });
      logger.info(`email data is ${data}`);

      if (data?.mailOtp == otp) {
        result = {
          success: true,
          message: "otp varification is successfully done",
        };
        await otpModel.findOneAndDelete({ email });
      }

      console.log("check equality otp to otpMail");
    }

    ///// for phoneNumber time
    if (phoneNumber) {
      if (!otpID) {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "please provide OtpID",
          data: {},
        });
      }
      result = await verifyOtp(phoneNumber, otpID, otp);
    }

    // check from my side result is successfull or not
    if (result?.success) {
      logger.info(`${result?.message}`);
      delete req.body.otp;
      delete req.body.otpID;
      return next();
    } else {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "OTP not Verified" });
    }
  } catch (error) {
    logger.error(`exception occurred at ${JSON.stringify(error)}`);
    next(error);
  }
};
