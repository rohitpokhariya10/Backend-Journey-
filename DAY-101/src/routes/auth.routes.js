const express = require("express")
const authController = require("../controllers/auth.controller")

const authRouter = express.Router()//mini server


console.log("Authentication controllers are here",authController)
//POST /api/auth/register 
//user ko register kregi application me
authRouter.post("/register", authController.registerController )


//POST /api/auth/login
//
authRouter.post("/login", authController.loginController)








module.exports=authRouter
