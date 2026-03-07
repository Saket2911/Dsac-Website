import "dotenv/config";
import mongoose from "mongoose";
import User from "./models/User.js";
import connectDB from "./config/db.js";

const ADMIN_EMAIL = "admin@dsac.com";
const ADMIN_PASSWORD = "Admin@123";
const ADMIN_NAME = "DSAC Admin";

async function seedAdmin() {
    await connectDB();

    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
        // Just promote to admin if already exists
        existing.role = "admin";
        await existing.save();
        console.log(`✅ User "${ADMIN_EMAIL}" promoted to admin.`);
    } else {
        const admin = new User({
            name: ADMIN_NAME,
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD, // will be hashed by pre-save hook
            role: "admin",
            college: "Vasavi College of Engineering"
        });
        await admin.save();
        console.log(`✅ Admin user created:`);
        console.log(`   Email:    ${ADMIN_EMAIL}`);
        console.log(`   Password: ${ADMIN_PASSWORD}`);
    }

    await mongoose.disconnect();
    process.exit(0);
}

seedAdmin().catch(err => {
    console.error("❌ Error seeding admin:", err.message);
    process.exit(1);
});
