const mongoose = require("mongoose");

/**
 * Establishes a connection to the MongoDB database using Mongoose.
 *
 * @description
 * This function reads the MongoDB connection URI from environment variables
 * and connects the application to the database.
 *
 * Why Environment Variables?
 * - Keeps sensitive information secure (URI / username / password)
 * - Prevents hardcoding credentials in source code
 * - Helps easily switch between dev / staging / production databases
 *
 * Example (.env):
 * MONGO_URI=mongodb://127.0.0.1:27017/notesDB
 *
 * NOTE:
 * Make sure to load environment variables before calling this function:
 * require("dotenv").config();
 *
 * @returns {Promise<void>} Resolves when the connection is established.
 */
const connectToDb = async () => {
  try {
    // Validate MongoDB URI before attempting connection
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in environment variables (.env file).");
    }

    /**
     * mongoose.connect() returns a Promise.
     * If the connection succeeds, the app will be connected to MongoDB.
     * If it fails, it will throw an error which we catch in the catch block.
     */
    await mongoose.connect(process.env.MONGO_URI);

    // Successful connection log
    console.log("✅ Database Connected Successfully");
  } catch (error) {
    // Error log for debugging and monitoring
    console.error("❌ Database Connection Failed:", error.message);
  }
};

module.exports = connectToDb;
