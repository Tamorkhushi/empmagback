import { StatusCodes } from "http-status-codes";
import logger from "../logger.js";
import {jwtGetToken} from "../services/library/jwt/jwtToken.js"
import { jwtVerifyToken } from "../services/library/jwt/varifyJwtToken.js";

// Generate token middleware
export const generateToken = (req, res, next) => {
  try {
    logger.info("Starting generateToken...");

    const userId = req.userId;
    if (!userId) {
      logger.error("userId not found");
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "userID not found." });
    }

    const token = jwtGetToken(userId);

    logger.info("generateToken ends");
    console.log("Generated Token:", token);

    return res.status(StatusCodes.ACCEPTED).json({
      success: true,
      message: "Token generated successfully",
      data: { token: token },
    });
  } catch (error) {
    logger.error(`generateToken error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Failed to generate token",
    });
  }
};



// Verify token middleware
export const verifyToken = (req, res, next) => {
  try {
    logger.info("Token verification starts");

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decodeToken = jwtVerifyToken(token);
      req.userId = decodeToken.userId;
      logger.info(`Token verification ended.`);
      if (req.userId) {
        return next();
      }
      throw new Error("jwt token not verified");
    } else {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Authorization header missing or malformed",
      });
    }
  } catch (error) {
    logger.error(`Token verification error ${error}`);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to verify token",
    });
  }
};

