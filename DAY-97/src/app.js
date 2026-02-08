
const express = require("express")
const authRouter = require("./routes/auth.routes")
const app = express()
const cookie = require("cookie-parser")


//middleware
app.use(express.json())



//we have to use authRouter here as a middleware
app.use("/api/auth" , authRouter)

module.exports = app