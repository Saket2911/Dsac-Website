import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.js";

/**
 * Admin authorization middleware.
 * Must be used AFTER the auth middleware so that req.user is populated.
 * Returns 403 if the user is not an admin.
 */
const adminAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || req.user.role !== "admin") {
        res.status(403).json({ message: "Access denied. Admin privileges required." });
        return;
    }
    next();
};

export default adminAuth;
