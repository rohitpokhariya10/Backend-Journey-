const express = require("express")
const app = express()
const authRouter = require("../src/routes/auth.routes")

app.use(express.json())//read req.body


app.use("/api/auth" , authRouter)
app.use("/api/auth", authRouter)






module.exports=app