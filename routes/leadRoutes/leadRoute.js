import express from "express";
import upload from "../../middleware/imgupload.js";
import { getLeads } from "./leadAllRoute/getLeads.js";
import { createLeads } from "./leadAllRoute/createLeads.js";
import { deleteLead } from "./leadAllRoute/deleteLead.js";
import { updateLead } from "./leadAllRoute/updateLead.js";

// router
const router = express.Router();

// Lead Management Routes
router.use("/gets_leads", getLeads);        
router.use("/create_leads", upload.single('avatar'), createLeads);          
router.use("/delete_leads", deleteLead);   
router.use("/update_leads", updateLead);   




export const leadRoute = router;













// ...................................new code

// import express from "express";
// import { getLeads } from "./leadAllRoute/getLeads.js";
// import { createLeads } from "./leadAllRoute/createLeads.js";
// import { deleteLead } from "./leadAllRoute/deleteLead.js";
// import { updateLead } from "./leadAllRoute/updateLead.js";
// const router = express.Router()

// router.use("/gets_leads", getLeads);        
// router.use("/create_leads", createLeads);          
// router.use("/delete_leads", deleteLead);   
// router.use("/update_leads", updateLead);   




// export const leadRoute = router;
//.............................................

