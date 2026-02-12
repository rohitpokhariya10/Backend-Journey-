const express = require("express")
const authRouter = require("./routes/auth.routes")
//const cookieParser = require("cookie-parser")

const app = express()

app.use(express.json())//middleware ehich read req.body
//app.use(cookieParser())//middleware which read cookies from req.body
app.use("/api/auth" , authRouter)//middleware-->which connect authrouter with app(server)














module.exports=app