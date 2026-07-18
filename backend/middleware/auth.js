import jwt from "jsonwebtoken";
import User from "../models/User.js";
const auth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      res.status(401).json({
        message: "No authentication token, access denied",
      });
      return;
    }
    const token = authHeader.replace("Bearer ", "");
    const jwtSecret = process.env.JWT_SECRET || "dsac_default_secret";
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(401).json({
        message: "Token is valid but user not found",
      });
      return;
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Token is not valid",
    });
  }
};
export default auth;
