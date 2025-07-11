import express from "express";
import { userRoute } from "./userRoutes/userRoute.js";
import { leadRoute } from "./leadRoutes/leadRoute.js";
const router = express.Router();
///////////////// for user routes  /////////////////
router.use("/user", userRoute);

///// for leads management ////
router.use("/lead", leadRoute);

export const mainRoute = router;
