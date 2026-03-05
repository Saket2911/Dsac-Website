import mongoose from "mongoose";

let isConnected = false;

const connectDB = async (retries = 5, delay = 2000): Promise<void> => {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/dsac";

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            await mongoose.connect(uri);
            isConnected = true;
            console.log("✅ MongoDB connected successfully");
            break;
        } catch (error) {
            console.error(`❌ MongoDB connection attempt ${attempt}/${retries} failed:`, error instanceof Error ? error.message : error);
            if (attempt < retries) {
                const waitTime = delay * attempt;
                console.log(`   Retrying in ${waitTime / 1000}s...`);
                await new Promise((r) => setTimeout(r, waitTime));
            } else {
                console.error("❌ All MongoDB connection attempts failed. Server will continue but DB endpoints will fail.");
            }
        }
    }

    mongoose.connection.on("error", (err) => {
        isConnected = false;
        console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("connected", () => {
        isConnected = true;
    });

    mongoose.connection.on("disconnected", () => {
        isConnected = false;
        console.warn("MongoDB disconnected. Attempting reconnection...");
    });
};

export { isConnected };
export default connectDB;
