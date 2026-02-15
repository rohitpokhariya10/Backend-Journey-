const userModel = require("../models/user.model")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")




const registerController = async (req , res)=>{
    const {username , email , password , bio , profileImage} = req.body

    const isUserExist = await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    })


    if(isUserExist){
        return res.status(409).json({
            message:"User already exist"
        })
    }
    

    //if user doesnot exist
    const hashPassword = await bcryptjs.hash(password , 10)
    const user = await userModel.create({
        username , email , bio , profileImage , password:hashPassword
    })
    console.log("SECRET:", process.env.JWT_SECRET);

    //create user token
    const token = jwt.sign(
       { id:user._id},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )
    res.cookie("JWT_TOKEN" , token)
    res.status(201).json({
        message:"User registered successfully",
        username:user.username,
        email:user.email,
        bio:user.bio,
        profileImage:user.profileImage
    })
   

}

const loginController = async (req,res)=>{
    const {username,email,password} = req.body
     

    //donu mese kisi ek se login krlega jo db me registered hoga
    const user = await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    })
    if(!user){
        return res.status(401).json({
            message:"Invalid credentials"
        })
    }
    const hashPassword = await bcryptjs.compare(password , user.password)
    if(!hashPassword){
        return res.status(401).json({
            message:"Invalid password"
        })
    }

    //Agar user exist krta hai plus password bhi shi hai
    const token = jwt.sign(
        {id:user._id},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )
    res.cookie("LOGIN_TOKEN" , token)
    res.status(201).json({
        message:"User Login Sucessfully",
        username:user.username,
        email:user.email,
        bio:user.bio,
        profileImage:user.profileImage,
        LoginCredentials:(`${user.email== email?`user login with ${email} `:`User login with ${username} `}`)

    })

}





module.exports = {registerController  , loginController}