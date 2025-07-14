// import express from "express";
// import { createMyLead } from "../../../controllers/leadController/leadAllController.js";
// import { verifyToken } from "../../../middleware/jwtMiddle.js";
// const router = express.Router();

// router.route("/").post(verifyToken, createMyLead)

// export const createLeads = router;


import express from "express";
import multer from "multer";
import { createMyLead } from "../../../controllers/leadController/leadAllController.js";
import { verifyToken } from "../../../middleware/jwtMiddle.js";

const router = express.Router();

// ✅ Multer Setup
const imgconfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `image-${Date.now()}-${file.originalname}`);
  },
});

const isImage = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("ONLY IMAGE IS ALLOWED"));
  }
};

const upload = multer({
  storage: imgconfig,
  fileFilter: isImage,
});

// ✅ Actual Route with BOTH middlewares
router.post("/", verifyToken, upload.single("photo"), createMyLead);

export const createLeads = router;
