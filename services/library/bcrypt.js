import bcrypt from "bcrypt";
import logger from "../../logger.js";

async function createHashedPassword(simplePassword) {
  const saltround = 10;
  try {
    const SecretKey = process.env.PASSWORD_SECRET_KEY;
    if (!SecretKey) logger.info("PASSWORD_SECRET_KEY is not found in env file so plz check first");

    const salt = await bcrypt.genSalt(saltround);
    const hashedPassword = await bcrypt.hash(simplePassword + SecretKey, salt);
    return hashedPassword;
  } catch (error) {
    logger.error(`error occurred at ${error}`);
  }
}


async function verifyHashedPassword(simplePassword,hashedPassword) {
    try {
        const key = process.env.PASSWORD_SECRET_KEY
        if (!key) logger.info("PASSWORD_SECRET_KEY is not found in env so plz check it first")
            
        const varifyPas = await bcrypt.compare(simplePassword + key, hashedPassword)
        return varifyPas
    } catch (error) {
        logger.error(`error occurred at ${error}`, { __filename })
    }

}

export { createHashedPassword, verifyHashedPassword }
