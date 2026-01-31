/**
 * Entry Point File (server.js / index.js)
 *
 * @description
 * This file is responsible for:
 * ✅ Loading environment variables
 * ✅ Starting the Express server
 * ✅ Connecting to MongoDB database
 */

require("dotenv").config(); // Loads variables from .env into process.env

// Importing Express app (routes + middleware are defined inside this file)
const app = require("./src/app");

// Importing database connection function
const connectToDb = require("./src/config/database");

/**
 * Server Port
 *
 * Best practice: Keep port in .env file for flexibility.
 * Example: PORT=3000
 */
const PORT = process.env.PORT || 3000;

/**
 * Start Server
 *
 * @description
 * app.listen() starts the server and begins listening for incoming requests.
 * After the server starts, APIs can be accessed at:
 * http://localhost:<PORT>
 */
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});

/**
 * Connect Database
 *
 * @description
 * Establishes connection with MongoDB so the server can
 * store and fetch data properly.
 */
connectToDb();
