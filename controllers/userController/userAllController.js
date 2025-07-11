import logger from "../../logger.js";
import UserModel from "../../models/userModels/userSchema.js"
import { createHashedPassword, verifyHashedPassword } from "../../services/library/bcrypt.js";
import { StatusCodes } from "http-status-codes";
import sendOTPOnEmail from "../../services/library/mailOTP.js";
import { ChangePasswordValidator, loginValidator, SendOtpValidator, signUpValidator } from "../../schema_validation/userData/login_signupvalidate.js";

export const checkAccountExist = async (req, res, next) => {
  try {
    console.log("request in checkAccountExist body for validation", req.body );
    const { phoneNumber, email } = await SendOtpValidator.validateAsync(req.body);
   console.log("hone Number:", phoneNumber);
   
    let user;
    if (phoneNumber) {
      user = await UserModel.findOne({ phoneNumber });
    } else if (email) {
      user = await UserModel.findOne({ email });
    }

    if (req?.baseUrl == "/api/users/user/send_signup_otp" || req?.baseUrl == "/api/users/user/send_phone_or_email_otp") {
      if (user) {

        console.log("user exits");
        
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "user already exist.", data: {} });
      } else {
        
        console.log("next fun call");
        return next();
      }
    } else if (req?.baseUrl == "/api/users/user/send_forgot_password_otp") {
      if (user) {
        logger.info(`check user ${user}`);  /// we receive error after next function is call
        return next();
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "user not exist.", data: {} });
      }
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Send_forgot_password_otp Or send_signup_otp Or /send_forgot_password_otp is only allowed route for send otp", data: {} });
    }

  } catch (error) {
    logger.error(`exception occurred at checkAccountExist : ${JSON.stringify(error)}`);
    next(error);
  }
};


export const signUpController=async(req,res,next)=>{
  try {
    let userData = await signUpValidator.validateAsync(req.body);

    logger.info(`signUp data ${JSON.stringify(userData)}`);


    let user;

    if (userData?.phoneNumber) {
      user = await UserModel.findOne({ phoneNumber: userData?.phoneNumber })
    }
    else if (userData?.email) {
      user = await UserModel.findOne({ email: userData?.email })
    }

    if (user) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "user already exist." })
    }

    userData.password = await createHashedPassword(userData.password)
    const newUser = await UserModel.create(userData);
    logger.info(`user created ${newUser}`)
    if (newUser._id) {
      req.userId = newUser._id;
      return next()
    }
    else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "user not created" })
    }
  } catch (error) {
    logger.error(`exception occurred at signUpController : ${JSON.stringify(error)}`);
    return next(error);
  }
}

/////////////////////////
export const loginController= async (req, res, next) => {
  try {
    let userData = await loginValidator.validateAsync(req.body);
    logger.info(`login start`);

    let user;
    if (userData?.phoneNumber) {
      user = await UserModel.findOne({ phoneNumber: userData?.phoneNumber }).select({ "password": 1 })
      logger.info(`user data ${user}`)
    }
    else if (userData?.email) {
      user = await UserModel.findOne({ email: userData?.email }).select({ "password": 1 })
    }

    if (!user) { res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: "user not found." }) }

    if (user && (await verifyHashedPassword(userData.password, user.password))) {
      req.userId = user._id;
      next()
    }
    else {
      res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: "wrong password!", data: {} })
    }
  } catch (error) {
    logger.error(`exception occurred at loginController : ${JSON.stringify(error)}`);
    next(error);
  }
};

//////////////////////////
export const passwordChangeController= async (req, res, next) => {
  try {
    let userData = await ChangePasswordValidator.validateAsync(req.body);

    logger.info(`password change start at passwordChangeController ${JSON.stringify(userData)}`);

    const password = await createHashedPassword(userData.password)

    let newUser;

    if (userData?.phoneNumber) {
      newUser = await UserModel.findOneAndUpdate(
        { phoneNumber: userData.phoneNumber },
        { $set: { password: password } },
        { new: true, returnOriginal: false }
      );
    } else if (userData?.email) {
      newUser = await UserModel.findOneAndUpdate(
        { email: userData.email },
        { $set: { password: password } },
        { new: true, returnOriginal: false }
      );
    } else {
      logger.error("phoneNumber or email is not provided in userData");
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "phoneNumber or email is not provided in userData" })
    }


    if (newUser?._id) {
      if (userData?.email) {

        const now = new Date();
        const options = {
          timeZone: 'Asia/Kolkata',
          hour12: true,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        };

        const istDateTime = new Intl.DateTimeFormat('en-IN', options).format(now);

        await sendOTPOnEmail({
          to: userData?.email || '',
          subject: "Your Password Has Been Updated",
          html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                  <h2>Password Update Notification</h2>
                  <p>Dear ${newUser.name || 'User'},</p>
                  <p>Your password has been successfully updated.</p>
                  <p>Date and Time (IST): <strong>${istDateTime}</strong></p>
                  <p>If you did not request this change, please contact us +91-9654853181 immediately.</p>
                  <p>Thank you for choosing us!</p>
              </div>
          `
        });
      }

      req.userId = newUser._id;

      return next();
    }
    else {
      throw new Error("issue with finding user")
    }

  } catch (error) {
    logger.error(`exception occurred at passwordChangeController : ${JSON.stringify(error)}`);
    return next(error);
  }
};



