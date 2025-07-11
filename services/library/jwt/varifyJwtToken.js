import jwt from "jsonwebtoken";
import logger from "../../../logger.js";

function jwtVerifyToken(token) {
    logger.info(`token validator starts in jwtVerifyToken. `)
    const key = process.env.JWT_SECRET_KEY;

    if (!key ) 
    { throw new Error("JWT_SECRET_KEY is not mention in env ") }
      try {
          const decode = jwt.verify(token, key);
          return decode;
        
      } catch (error) {
          logger.error(`Exception occurred at validation function ${error}`)
          throw new Error('Token validator failed');
        }
}
export { jwtVerifyToken };
