import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const otpSchema = new Schema({
  email: { type: String },
  mailOtp: { type: String },
  expiresAt: { type: Date, required: true }
});

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 1 });

const otpModel = model('otp', otpSchema);

export default otpModel;
