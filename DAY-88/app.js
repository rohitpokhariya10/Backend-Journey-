const express =require("express")
const app = express()
//middleware--> express server req.body ko read kar sake
app.use(express.json())



const notes = [

]
//console.log(notes);

// POST method
//Api name -> /notes
app.post("/notes", (req,res)=>{
    console.log(req.body);
    notes.push(req.body)
    console.log(notes);
    
    res.send("Notes created:)")
    
})

app.get("/notes" , (req,res)=>{
    res.send(notes);
})

app.delete("/notes/:index" , (req,res)=>{
    //console.log(req.params);
    console.log(notes);
    
    console.log(req.params.index);
    delete notes[req.params.index]
    console.log(notes);
    
    res.send("notes deleted successfully:)")
    
})










module.exports = app