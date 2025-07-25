// import express from "express";
// import upload from "../../middleware/imgupload.js";
// import { getLeads } from "./leadAllRoute/getLeads.js";
// import { createLeads } from "./leadAllRoute/createLeads.js";
// import { deleteLead } from "./leadAllRoute/deleteLead.js";
// import { updateLead } from "./leadAllRoute/updateLead.js";

// // router
// const router = express.Router();

// // Lead Management Routes
// router.use("/gets_leads", getLeads);        
// router.use("/create_leads", upload.single('avatar'), createLeads);          
// router.use("/delete_leads", deleteLead);   
// router.use("/update_leads", updateLead);   


// export const leadRoute = router;













// ...................................new code
import express from "express";
import upload from "../../middleware/imgupload.js";
import { getLeads } from "./leadAllRoute/getLeads.js";
import { deleteLead } from "./leadAllRoute/deleteLead.js";
import { updateLead } from "./leadAllRoute/updateLead.js";
import { verifyToken } from "../../middleware/jwtMiddle.js";
import { createMyLead } from "../../controllers/leadController/leadAllController.js";

const router = express.Router();

// GET Leads
router.use("/gets_leads", getLeads);

// ✅ Create Lead with Image
router.post("/create_leads", verifyToken, upload.single("avatar"), createMyLead);

// DELETE Lead
router.use("/delete_leads", deleteLead);

// UPDATE Lead
router.use("/update_leads", updateLead);

export const leadRoute = router;

//.............................................

