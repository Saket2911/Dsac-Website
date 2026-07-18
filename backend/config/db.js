import mongoose from "mongoose";

// In serverless environments, we want to cache the DB connection
// across invocations to prevent creating a new pool for every request.
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/dsac";

    // Fail fast in serverless environments rather than retrying for 20-30s
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    console.log("Connecting to MongoDB...");
    cached.promise = mongoose
      .connect(uri, opts)
      .then((mongoose) => {
        console.log("✅ MongoDB connected successfully");
        return mongoose;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection failed:", err.message);
        cached.promise = null;
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};

// Exporting dummy isConnected for backwards compatibility if needed
export const isConnected = true;
export default connectDB;
