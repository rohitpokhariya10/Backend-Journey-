const express = require("express")
const userModel = require("../models/user.model")
const crypto = require("crypto")
const jwt = require("jsonwebtoken")




//authRouter ki help se hi ab es file me authentication ke sare routes create krenge
const authRouter = express.Router()


//POST /api/auth/register
authRouter.post("/register", async (req,res)=>{
   try{ 
    const {name , email , password} = req.body
    //check user already exist with this email or not
    const isUserExist = await userModel.findOne({email})
    if(isUserExist){
       return res.status(409).json({
            message:"user already exist"
        })
    }
    
    //if user doesnot exist user ka data save kro database me
    const user = await userModel.create(
        {name,
         email,
         //Database me hash password krenge 
         password: crypto.createHash("md5").update(password).digest("hex")}
    )
    console.log("User details", user)//object me milega
    //user create hogya ab -->token create kro user data ke sath
    const token = jwt.sign(
        {
            id:user._id
        },
        process.env.JWT_SECRET,
        {
            expiresIn:"8h"
        }
    )

    //server token ko client ke cookiestorage me store kar deta hai
    res.cookie("JWT_TOKEN", token)//client side me toke ko cookie storage me set karr rhi hai
       res.status(201).json({
        message:"User registered successfully",
        user:{
            name:user.name,
            email:user.email
        }
    })
}
catch(error){
    res.status(401).json({
        message:"User registration failed",error
    })

}

})

authRouter.get('/get-me', async (req, res) => {
    try {
        const token = req.cookies.JWT_TOKEN;//client ki req se token nikala
        
        //agar client ki rq se token nhi mila tuh messsage bhejo
        if (!token) {
            return res.status(401).json({ message: "No token found" });
        }
        
        //agar token hai client request me tuh check kro token valid hai ya nahi
        //token-->jo req.body se mila hoga (ye token client ki req ke sath aya hoga)
        //JWT_SECRET --> server apni secret key se us token ko verify krega
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

            //iat-->token kab bana tha
            //exp--> token kab marega (expire hoga).
        console.log(decoded)//{ id: '698c641dc291ef4bbc4c926e', iat: 1770808349, exp: 1770811949 }
        
        //jis user ne req kari thi us user ke bare me pata chalgya ki kis user ne req ki
        const user = await userModel.findById(decoded.id)

        
        res.status(201).json({
            message:"token verified successfully",

            email:user.email,
            name:user.name

        })
       
    } catch (
        error) {
        res.status(401).json({ message: "Invalid or expired token" },error);
    }
});





















module.exports=authRouter