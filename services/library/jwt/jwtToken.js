import jwt from "jsonwebtoken";
import logger from "../../../logger.js";

    export const jwtGetToken = (id) => {
    logger.info(`token generation starts.`)
    const key= process.env.JWT_SECRET_KEY;
    const expires= process.env.JWT_EXPIRES_IN;

    if (!key || !expires) 
    { throw new Error("JWT_SECRET_KEY or JWT_EXPIRES_IN is not defined in environment variables") }
    
    const options = { expiresIn: expires };

  const payload = { userId: id }
      try {
          const token = jwt.sign(payload, key,options);
          return token;
        
      } catch (error) {
          logger.error(`Exception occurred at generateToken function ${error}`)
          throw new Error('Token generation failed');
        }
}
