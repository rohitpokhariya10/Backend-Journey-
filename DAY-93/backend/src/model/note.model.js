// Yha data ka schema define krte hai
const mongoose = require("mongoose")

const notesSchema = new mongoose.Schema({
    title:String,
    description:String
})

 const noteModel = mongoose.model("notes" , notesSchema)
 //console.log(noteModel);
 

 module.exports = noteModel