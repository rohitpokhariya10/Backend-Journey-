const express = require("express")
const app = express()//start the server
const authrouter = require("./routes/auth.routes")

app.use(express.json())//helps to read req.body 


app.use("/api/auth" , authrouter)
app.use("/api/auth" , authrouter)



module.exports = app


