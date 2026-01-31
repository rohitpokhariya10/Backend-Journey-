const express = require("express");
const Note = require("./models/notes.model"); // Notes Model import

const app = express();

/**
 * ✅ Middleware: JSON Body Parser
 *
 * @description
 * This middleware converts incoming JSON request body into a usable JS object.
 * Example:
 * req.body = { title: "...", description: "..." }
 */
app.use(express.json());

/* -------------------------------------------------------------------------- */
/*                              NOTES ROUTES                                   */
/* -------------------------------------------------------------------------- */

/**
 * ✅ POST /notes
 *
 * @description
 * Creates a new note in the database.
 *
 * Request Body Example:
 * {
 *   "title": "My Note",
 *   "description": "This is my note description"
 * }
 *
 * Response:
 * - 201 Created (success)
 * - 400 Bad Request (validation error)
 * - 500 Internal Server Error (server/db error)
 */
app.post("/notes", async (req, res) => {
  try {
    /**
     * Extracting required fields from request body.
     * Destructuring helps write clean and readable code.
     */
    const { title, description } = req.body;

    /**
     * Basic Validation (Industry Practice)
     * We check if required fields exist before hitting database.
     */
    if (!title || !description) {
      return res.status(400).json({
        message: "Title and Description are required ❌",
      });
    }

    /**
     * Creating note in DB
     * Note.create() returns a Promise, so we use await to get saved data.
     */
    const note = await Note.create({
      title,
      description,
    });

    // Success Response
    return res.status(201).json({
      message: "✅ Note created successfully",
      note,
    });
  } catch (error) {
    /**
     * If any error occurs:
     * - DB issue
     * - Validation issue
     * - Unexpected server error
     */
    return res.status(500).json({
      message: "❌ Something went wrong while creating note",
      error: error.message,
    });
  }
});

/**
 * ✅ GET /notes
 *
 * @description
 * Fetches all notes from the database.
 *
 * Response:
 * - 200 OK (success)
 * - 500 Internal Server Error (server/db error)
 */
app.get("/notes", async (req, res) => {
  try {
    /**
     * Fetching all notes
     * .find() returns all documents from "notes" collection.
     */
    const notes = await Note.find();

    return res.status(200).json({
      message: "✅ Notes fetched successfully",
      totalNotes: notes.length,
      notes,
    });
  } catch (error) {
    return res.status(500).json({
      message: "❌ Error while fetching notes",
      error: error.message,
    });
  }
});

module.exports = app;
