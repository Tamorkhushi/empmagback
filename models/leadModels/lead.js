import mongoose from "mongoose";
import { Schema, model } from 'mongoose';

const leadSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  status: { type: String, enum: ['New', 'Contacted', 'Closed'], default: 'New' },
  phoneNumber: { type: String, required: true, unique: true },
  imgpath: { type: String }, 
  date:{ type:Date },
  
},{ timestamps: true });

const leadModel = model('Lead', leadSchema);

export default leadModel;