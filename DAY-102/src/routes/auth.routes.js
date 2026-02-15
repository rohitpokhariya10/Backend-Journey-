const express = require("express")
const authController = require("../controllers/auth.controllers")


const authRouter = express()


authRouter.post("/register" , authController.registerController)//middleware

authRouter.post("/login" , authController.loginController)


module.exports = authRouter