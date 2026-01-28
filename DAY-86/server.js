const express = require("express") //import express
const app = express()

app.listen(4000)

app.get('/', (request,response)=>{
    response.send("Radha Radha")
})

app.get('/about',function(req,res){
    res.send("Hari Bol | Radhe Radhe | Hare Krishna")
})
