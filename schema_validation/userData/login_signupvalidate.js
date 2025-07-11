import Joi from "joi";

const name=Joi.string().min(3).required("name is required")

const phoneNumber = Joi.string()
// .length(10)
// .pattern(/[6-9]{1}[0-9]{9}/)
.messages({
  "string.empty": "Phone number cannot be empty.",
})

const email = Joi.string().email().messages({
  "string.empty": "Email cannot be empty.",
  "string.email": "Invalid email format.",
})
const otp = Joi.string().length(4).required().messages({
  'any.required':"otp is required",
  'string.base': 'otp must be a string',
  'string.empty': `otp can't be empty`,
  'string.length': `OTP must be 4 digits`,
})
const otpID = Joi.string().allow("", null).messages({
  'string.base': 'otpID must be a string',
})

const password = Joi.string()
// .pattern(new RegExp("^[a-zA-Z0-9@]{3,30}$"))
.required()
.messages({
  'any.required': 'password is required',
})

// Schema for sign-up validation
const validateSignUp = Joi.object({
  name,
  phoneNumber,
  email,
  password,
}).xor('phoneNumber', 'email').messages({
  'object.xor': 'Provide either Phone number or Email, but not both or neither',
});

// Schema for login validation
const validateLogin = Joi.object({
  phoneNumber,
  email,
  password,
}).xor('phoneNumber', 'email').messages({
  'object.xor': 'Provide either Phone number or Email, but not both or neither',
});

const validateSendOtp = Joi.object({
  phoneNumber,
  email,
}).xor('phoneNumber', 'email').messages({
  'object.xor': 'Provide either Phone number or Email, but not both or neither',
});
const validateVerifyOtp = Joi.object({
  phoneNumber,
  email,
  otp,
  otpID
}).xor('phoneNumber', 'email').messages({
  'object.xor': 'Provide either Phone number or Email, but not both or neither',
});



// for  password change
const validateChangePassword = Joi.object({
  phoneNumber,
  email,
  password,
}).xor('phoneNumber', 'email').messages({
  'object.xor': 'Provide either Phone number or Email, but not both or neither',
});



// export const SendOtpValidator = validateSendOtp;
export const SendOtpValidator=validateSendOtp;
export const VerifyOtpValidator=validateVerifyOtp;
export const signUpValidator=validateSignUp;
export const loginValidator=validateLogin;
export const ChangePasswordValidator = validateChangePassword;
