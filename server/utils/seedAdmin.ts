import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/dsac";

async function seedAdmin() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Connected to MongoDB");

        // Check if admin already exists
        const existing = await User.findOne({ email: "admin@dsac.club" });
        if (existing) {
            // Just update role to admin if exists
            existing.role = "admin";
            await existing.save();
            console.log("✅ Existing user updated to admin role");
            console.log(`   📧 Email: admin@dsac.club`);
            console.log(`   🔑 Password: (unchanged)`);
        } else {
            // Create new admin user
            const admin = new User({
                name: "DSAC Admin",
                email: "admin@dsac.club",
                password: "Admin@123",
                role: "admin",
                college: "Vasavi College of Engineering",
                platformIds: {
                    leetcodeId: "",
                    codeforcesId: "",
                    codechefId: "",
                    hackerrankId: "",
                },
            });
            await admin.save();
            console.log("✅ Admin user created successfully!");
            console.log(`   👤 Name: DSAC Admin`);
            console.log(`   📧 Email: admin@dsac.club`);
            console.log(`   🔑 Password: Admin@123`);
            console.log(`   🛡️  Role: admin`);
        }

        await mongoose.disconnect();
        console.log("\n✅ Done. You can now log in with these credentials.");
        console.log("   There is NO separate admin login page.");
        console.log("   Log in on the normal auth page → click the user icon → 'Admin Dashboard'");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
}

seedAdmin();
