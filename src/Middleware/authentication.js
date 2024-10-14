const jwt = require("jsonwebtoken");
const { env } = require("../../env_constants.js");
const { USERS } = require("../Models/user.js");
const { logWriter } = require("../Logger/LogWriter.js");
const { CryptoBytes } = require("../Helpers/CryptoBytes.js");
const STUDENT = require("../Models/students.js");

const logger = logWriter("authentication-service");

const AUTH = async function (req, res, next) {
  try {
    // console.log(req);
    // res.setHeader("Access-Control-Allow-Origin", "*");

    const userToken = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(userToken, env.JWT_TOKEN_ENCRYPT_CODE);
    // Check in USERS schema
    let userObj = await USERS.findOne({ userID: decoded.userID});

    // If not found in USERS, check in STUDENTS schema
    if (!userObj) {
      userObj = await STUDENT.findOne({ userID: decoded.userID });
    }

    if (!userObj) {
      logger.error("Invalid token or user is not active");
      res.status(401).send({ exp: "Login error." });
      return;
    }

    req.userID = userObj.userID;
    req.role=userObj.role;
    req.userObj=userObj;
    req.reqID = CryptoBytes();

    next();
  } catch (error) {
    console.log(error);
    logger.error(`Error in authentication middleware: ${error.message}`);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(401).send({ exp: "Login error." });
  }
};

module.exports = { AUTH };
