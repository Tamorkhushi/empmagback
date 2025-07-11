import Joi from "joi";

export const leadSchemavalidate = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().messages({
      "string.empty": "Email cannot be empty.",
      "string.email": "Invalid email format.",
    }),
    status: Joi.string().valid('New', 'Contacted', 'Closed'),
    phoneNumber: Joi.string().messages({
      "string.empty": "Phone number cannot be empty.",
    }),
  });


  