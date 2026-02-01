const express = require("express")//import express package
const noteModel = require("./model/note.model")
const cors = require("cors");
//Server Created
const app = express()

//CORS middleware-->allows this server to handle req from different origins(like frontend apps) by adding appropriate header
app.use(cors())
//Middleware
app.use(express.json())

// Api Name = /api/notes
// API METHOD = POST
//create new note and save into database
app.post("/api/notes", async (req,res)=>{
 const {title , description} = req.body
  const note = await noteModel.create({
    //model ka ye create method ek promise return krta islie hum await lagate hai
    //Create()--> ye sirf ek new object return krta hai
        title,description
    })
    console.log("response of mongodb ", note);
    
    res.status(201).json({
        message:"Notes Crfeated Successfully...",
        note
    })
})

// Api Name = /api/notes
// API METHOD = GET
//Fetch all the notesdata from  mongodb and send them in the response
app.get("/api/notes",async (req,res)=>{
    //find() is a model method ye humesha array return karegi and data humesha array of objects ke form me return krti  hai
     const note =  await noteModel.find()
     res.status(200).json({
        message:"Notes fetch Successfully",
        note
     })
})

// Api Name = /api/notes/:id--->/api ye jo lgaya hai ye bas sirf format hai ki backend ki ye api hai
// API METHOD = DELETE
//Delete note with the help of unique id which come from req.body
app.delete("/api/notes/:id", async (req,res)=>{
    //console.log("req.params.id:",req.params.id);
    const id  = req.params.id
    //findByIdAndDelete()--> id ke basis me find kregi and delete kregi
    const note = await noteModel.findByIdAndDelete(id)
    //console.log("This is deleted note :",id);
    res.status(200).json({
        message:"Note deleted Successfully",
        note
    })
})

// Api Name = /api/notes/:id
// API METHOD = PATCH
//Update the despription of the notes by id
//req.body me description arha hoga
app.patch("/api/notes/:id", async (req,res)=>{
          const id =  req.params.id
          console.log(req.params);
          //destructuring krke req.body se description nikal rh hai
          const {description} = req.body
          //findByIdAndUpdate(id do , jo field update krni hai use object ke form me do)
          const note = await noteModel.findByIdAndUpdate(id , {description})
          res.status(200).json({
            message:"Note description updated successfully",
            note
          })
})





















//export server
module.exports = app