const express = require("express")

const app = express()

app.listen(3000,()=>{
    console.log("Server is running on port 3000"); 
})

const notes = []
//middleware taki req.body ko express padh paye
app.use(express.json())

//post request-->to create notes/resources on server
app.post('/notes',(req,res)=>{
    console.log(req.body);
    notes.push(req.body)
    res.send("Notes Created")
})

//get request-->for fetch notes/resources
app.get('/notes',(req,res)=>{
  res.send(notes)
})