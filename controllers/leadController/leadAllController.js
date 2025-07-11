import { StatusCodes } from "http-status-codes";
import leadModel from "../../models/leadModels/lead.js";
import { leadSchemavalidate } from "../../schema_validation/leadValidation/leadValidate.js";
import path from 'path'

//  get own leads for perticular user
export const getMyLeads = async (req, res) => {
  try {
    const leads = await leadModel.find({ userId: req.userId });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Getting all leads successfully",
      data: { Leads: leads },
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: "Error fetching leads", data: {} });
  }
};

// Add/ create lead
// export const createMyLead = async (req, res) => {
//   const { name, email, phoneNumber,status } = req.body;

//   if (!name || !email ||!phoneNumber ||!status) {
//     return res.status(StatusCodes.BAD_REQUEST).json({
//       success: false,
//       message: 'All fields are required',
//       data: {},
//     });
//   }

//  const leadData= await leadSchemavalidate.validateAsync({ name, email, phoneNumber,status });

//   let Lead;

//   //// for checking lead is already exits or not //////
//   // if (leadData?.phoneNumber) {
//   //   Lead = await leadModel.findOne({ phoneNumber: leadData?.phoneNumber })
//   // }
//   // else if (leadData?.email) {
//   //   Lead = await leadModel.findOne({ email: leadData?.email })
//   // }

//    Lead = await leadModel.find({
//     userId: req.userId,
//     $or: [
//       { phoneNumber: leadData.phoneNumber },
//       { email: leadData.email },
//     ],
//   });

//   if (Lead.length > 0) {
//     return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message:"A lead with this email or phone number already exists" })
//   }

//   try {
//     const newLead = new leadModel({
//       name,
//       email,
//       phoneNumber,
//       status: status || 'New',
//       userId: req.userId, // Ensure this matches the schema field
//     });
//      await newLead.save();

//     res.status(StatusCodes.CREATED).json({
//       success: true,
//       message: 'Lead is created successfully ',
//       data: { lead: newLead },
//     });
//   } catch (error) {
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       // message: error,
//       message: 'Error adding lead ',
//       data: {},
//     });
//   }
// };

// ...................................................newcode
export const createMyLead = async (req, res) => {
  try {
    // ✅ req.body comes from multer for multipart/form-data
    const { name, email, phoneNumber, status } = req.body;
    console.log(req.body)
    console.log(res)

    // ✅ req.file comes from multer
    const avatar = req.file ? `/uploads/${req.file.filename}` : null;

    // ✅ required field check (include avatar here)
    if (!name || !email || !phoneNumber || !status || !avatar) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    // ✅ Joi Validation
    const leadData = await leadSchemavalidate.validateAsync({
      name,
      email,
      phoneNumber,
      status,
    });

    // ✅ Check if lead already exists
    const existingLead = await leadModel.find({
      userId: req.userId,
      $or: [
        { phoneNumber: leadData.phoneNumber },
        { email: leadData.email },
      ],
    });

    if (existingLead.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'A lead with this email or phone number already exists',
      });
    }

    // ✅ Create new lead
    const newLead = new leadModel({
      name,
      email,
      phoneNumber,
      status: status || 'New',
      avatar,
      userId: req.userId,
    });

    await newLead.save();

    res.status(201).json({
      success: true,
      message: 'Lead is created successfully',
      data: { lead: newLead },
    });

  } catch (error) {
    console.error("Create Lead Error:", error);
    res.status(500).json({
      success: false,
      message: error?.message || 'Error adding lead',
      data: {},
    });
  }
};

// ............................end new code





// update any perticular lead
export const deleteMyLead = async (req, res) => {
  const { id } = req.params;

  try {
    const lead = await leadModel.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!lead) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success:false, message: "Lead not found or unauthorized", data:{} });
    }

    res.status(StatusCodes.OK).json({ success:true, message: "Lead deleted successfully" });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success:false, message: "Error deleting lead", data:{}});
  }
};

// delete any perticular lead
export const updateMyLead = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  
  try {

    const existingLead = await leadModel.findOne({
      userId: req.userId,
      _id: { $ne: id }, // Exclude the current lead being updated
      $or: [
        { email: updateData.email },
        { phoneNumber: updateData.phoneNumber }
      ],
    });

    if (existingLead) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "A lead with this email or phone number already exists in your account.",
        data: {},
      });
    }

    const updatedLead = await leadModel.findByIdAndUpdate( { _id: id, userId: req.userId}, { $set: updateData }, { new: true });
    if (!updatedLead) return res
    .status(StatusCodes.NOT_FOUND)
    .json({ success:false, message: "Lead not found or unauthorized", data:{} });

    res.status(StatusCodes.OK).json({ success:true, message: "Lead updated successfully", data:{updatedLead} });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success:false, message: "Error updating lead", data:{}});
  }
};