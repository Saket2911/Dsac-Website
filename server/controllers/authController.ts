import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (userId: string): string => {
    const secret = process.env.JWT_SECRET || "dsac_default_secret";
    return jwt.sign({ userId }, secret, { expiresIn: "7d" });
};

export const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, college, leetcodeId, codeforcesId, codechefId, hackerrankId } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({ message: "Name, email, and password are required" });
            return;
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            res.status(400).json({ message: "User with this email already exists" });
            return;
        }

        const user = new User({
            name,
            email: email.toLowerCase(),
            password,
            college: college || "",
            platformIds: {
                leetcodeId: leetcodeId || "",
                codeforcesId: codeforcesId || "",
                codechefId: codechefId || "",
                hackerrankId: hackerrankId || "",
            },
        });

        await user.save();
        const token = generateToken(user._id as string);

        res.status(201).json({
            message: "User created successfully",
            token,
            user,
        });
    } catch (error: any) {
        console.error("Signup error:", error);
        if (error.code === 11000) {
            res.status(400).json({ message: "Email already registered" });
            return;
        }
        res.status(500).json({ message: "Server error during signup" });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }

        const token = generateToken(user._id as string);

        res.json({
            message: "Login successful",
            token,
            user,
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error during login" });
    }
};
