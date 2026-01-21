const express = require("express") //import express
const app = express()

app.listen(4000)

app.get('/', (req,res)=>{
    res.send("Radha Radha")
})

app.get('/about',function(req,res){
    res.send("Hari Bol | Radhe Radhe | Hare Krishna")
})
