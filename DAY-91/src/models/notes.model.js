const mongoose = require("mongoose");

/**
 * Notes Schema (MongoDB Document Structure)
 *
 * @description
 * A schema defines the structure (blueprint) of the documents stored in a MongoDB collection.
 * It tells MongoDB what fields will exist and what their data types will be.
 */
const notesSchema = new mongoose.Schema(
  {
    /**
     * Note Title
     * @type {String}
     * Stores the heading/title of the note.
     */
    title: {
      type: String,
      trim: true, // Extra spaces remove karega
      required: true, // Title compulsory hoga
    },

    /**
     * Note Description
     * @type {String}
     * Stores the main content/details of the note.
     */
    description: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    /**
     * Automatically adds:
     * createdAt -> when document created
     * updatedAt -> when document updated
     */
    timestamps: true,
  }
);

/**
 * Notes Model
 *
 * @description
 * A model is created using the schema.
 * It is used to perform CRUD operations on the database:
 * - Create
 * - Read
 * - Update
 * - Delete
 *
 * IMPORTANT:
 * The first argument is the model name.
 * Mongoose will automatically create the collection name in plural form.
 * Example:
 * Model name: "Note" -> Collection: "notes"
 */
const Note = mongoose.model("Notes", notesSchema);

/**
 * Export the model so it can be used in controllers/routes.
 */
module.exports = Note;
