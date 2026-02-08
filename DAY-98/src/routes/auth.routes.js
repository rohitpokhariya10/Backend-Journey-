const express = require("express")
const userModel = require("../models/user.model")
const crypto = require("crypto")//
const cookie= require("cookie-parser")
const jwt = require("jsonwebtoken")

const authRouter = express.Router()


//1 route --> /api/auth/register
authRouter.post("/register" , async (req,res)=>{
    const {name , email , password} = req.body

    const isUserExist = await userModel.findOne({email})
    if(isUserExist){
        return res.status(409).json({
            message:"user already exist with this email..."
        })
    }
    //if email doesnot exist in db save the user data in the Database
    const user = await userModel.create({
        name , 
        email , 
        password:crypto.createHash("md5").update(password).digest("hex")
    })
    
    const token = jwt.sign(
        {
            id : user._id
        },
        process.env.JWT_SECRET
    )

    res.cookie("JWT_TOKEN" , token)
    res.status(201).json({
        message:"user registered successfully",
        user,
        token
    })
    
})

//2 route --> /api/auth/login
authRouter.post("/login", async (req,res) => {
   const {email , password} = req.body//destructuring
   const user = await userModel.findOne({email})

   if(!user){
    return res.status(404).json({
        message:"user does not exist"
    })
   }
  const hashPassword =crypto.createHash("md5").update(password).digest("hex")
  
   const isPasswordMatched = user.password === hashPassword
   if(!isPasswordMatched){
    return res.status(401).json({
        message:"Invalid password"
    })

   }
   //if email is registered and pasword is coorect then login  the user
   const token = jwt.sign(
    {
        id:user._id
    },
    process.env.JWT_SECRET
   )
   
   res.cookie("JWT_TOKEN" , token)
   res.status(200).json({
    message:"Login successfully"
   })

})

module.exports =  authRouter