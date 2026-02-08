const express = require("express")
const userModel = require("../models/user.model")

const authRouter = express.Router()
const jwt = require("jsonwebtoken")//require jwt


//route Method: POST
//route name : /register

authRouter.post("/register" , async (req,res)=>{
      const {name , email , password} = req.body
      const isUserExist = await userModel.findOne({email})
      if(isUserExist){
        res.status(409).json({
            message:"User already exist with this email..."
        })

      }
      //if user does not exist create a new user
      const user = await userModel.create({
        name , email , password
      })
      //Now we have to create a token after user suceessfully registration
      const token = jwt.sign(
        {
            id:user._id,
            email:user.email
        },
        process.env.JWT_SECRET
      )
      //send token into client browser cookies storage
      res.cookie("JWT_TOKEN" , token)//key value

      res.status(201).json({
        message:"User registered successfully",
        user,
        token//send token to client 
      })
})








module.exports = authRouter