require("dotenv").config()
const express = require("express")
const app = express()
const authRouter = require("./routes/auth.routes")
const cookieParser = require("cookie-parser")




app.use(express.json())
app.use(cookieParser())//cookieparser middleware implemented-->incoming http req se cookies ko read kr leta hai-->ye middleware authRouter se phele lgana pdta hai


app.use("/api/auth", authRouter)//
//middleware


module.exports = app