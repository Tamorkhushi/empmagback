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
// import upload from "../../middleware/imgupload.js";
import { getLeads } from "./leadAllRoute/getLeads.js";
import { createLeads } from "./leadAllRoute/createLeads.js";
import { deleteLead } from "./leadAllRoute/deleteLead.js";
import { updateLead } from "./leadAllRoute/updateLead.js";
import multer from "multer";

// router
const router = express.Router();

const imgconfig = multer.diskStorage({
    destination:(req,file,cb)=>{
      cb(null,"./uploads")
    },
    filename:(req,file,cb)=>{
        cb(null,`image-${Date.now()}.${file.originalname}`)
    }
})

const isImage = (req,file,cb)=>{
    if(file.mimetype.startsWith("image")){
        cb(null,true)
    }else{
        cb(new Error("ONLY IMAGE IS ALLOWED"))
    }
}

const upload = multer({
    storage:imgconfig,
    fileFilter:isImage
})

// Lead Management Routes
router.use("/gets_leads", getLeads);        
router.use("/create_leads", upload.single('photo'), createLeads);          
router.use("/delete_leads", deleteLead);   
router.use("/update_leads", updateLead);   




export const leadRoute = router;
//.............................................

