const express = require("express")
const app = express()

const authRouter = require("../src/routes/auth.routes")
const postRouter = require("../src/routes/post.routes")

app.use(express.json()) // read JSON data from req.body

// auth related routes (login, register, logout)
app.use("/api/auth", authRouter)

// post related routes (create, update, delete)
app.use("/api/post", postRouter)

module.exports = app
