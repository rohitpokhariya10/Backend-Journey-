const express = require("express");
const app = express();

//  Middleware: req.body ko read karne ke liye (JSON data)
app.use(express.json());

//  Notes store karne ke liye array (in-memory)
const notes = [];


// POST: Create a new note
// API: /notes
app.post("/notes", (req, res) => {
  console.log("Body:", req.body);

  // note ko array me add kar rahe hain
  notes.push(req.body);

  console.log("All Notes:", notes);

  res.send("Notes created :)");
});


//  GET: Get all notes
// API: /notes
app.get("/notes", (req, res) => {
  res.send(notes);
});


// ✅ DELETE: Delete note by index
// API: /notes/:index
app.delete("/notes/:index", (req, res) => {
  console.log("All Notes (before delete):", notes);
  console.log("Index to delete:", req.params.index);

  //  delete operator index ko empty kar deta hai (null/undefined like slot)
  delete notes[req.params.index];

  console.log("All Notes (after delete):", notes);

  res.send("notes deleted successfully :)");
});


//  PATCH: Update note description by index
// API: /notes/:index
app.patch("/notes/:index", (req, res) => {
  // description update kar rahe hain
  notes[req.params.index].description = req.body.description;

  res.send("Note update hogya :)");
});

//  PUT: Complete update of a note by index
// API: /notes/:index
// Notes: PUT me hum pura object replace kar dete hain (title + description dono)
// Example body: { "title": "new", "description": "new desc" }
app.put("/notes/:index",(req,res)=>{
    notes[req.params.index]  = req.body
    res.send("update successfully")
})

module.exports = app;
