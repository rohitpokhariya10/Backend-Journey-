// Post model import (database se post create karne ke liye)
const postModel = require("../models/post.model")

// ImageKit import (image upload karne ke liye)
const ImageKit = require("@imagekit/nodejs")
const { toFile } = require("@imagekit/nodejs")

// JWT import (user verify karne ke liye)
const jwt = require("jsonwebtoken")


// ImageKit configuration (private key env file se aa rahi hai)
const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
})


// Post create controller
async function createPostController(req, res) {

    // Body aur file check karne ke liye
    console.log(req.body, req.file)

    // Cookies check karne ke liye
    console.log("cookies", req.cookies)

    // JWT token cookie se nikal rahe hain
    const token = req.cookies.JWT_TOKEN

    // Agar token nahi mila → unauthorized
    if (!token) {
        return res.status(401).json({
            message: "Token not provided, Unauthorized access"
        })
    }

    let decoded = null
    
    // Token verify kar rahe hain
    // Agar token galat hua to 401 bhejenge
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
        return res.status(401).json({
            message: "User not authorized"
        })
    }

    console.log(decoded)

    // Image ko ImageKit pe upload kar rahe hain
    const file = await imagekit.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), 'file'), // image buffer convert
        fileName: "image", // file ka naam
        folder: "cohort-2-insta-clone-posts" // folder name
    })
 
    // Database me post create kar rahe hain
    const post = await postModel.create({
        caption: req.body.caption,     // user ka caption
        imageUrl: file.url,            // uploaded image ka URL
        userId: decoded.id             // kis user ne post create kri us user ki id store in database
    })

    // Success response
    res.status(201).json({
        message: "Post created successfully.",
        post
    })
}



//  Jab user login karta hai
//  Fir user apni posts dekhna chahta hai
//  Toh server ko pata hona chahiye:
// Kaunsa user request bhej raha hai?
// Uski kaunsi posts database se fetch karni hai?
// Isliye ye route banaya gaya:
//"Jo user request kare, server uski hi sari posts dikha de"
async function getPostController(req,res){
    //console.log(req.cookies)
    const {JWT_TOKEN}= req.cookies

      // Agar token nahi mila → unauthorized
    if (!JWT_TOKEN) {
        return res.status(401).json({
            message: "Token not provided, Unauthorized access"
        })
    }
    
    //token verify
    let decoded
    try{
        decoded  = jwt.verify(JWT_TOKEN , process.env.JWT_SECRET)
    }
    catch(error){
        return res.status(401).json({
            message:"Invalid token"
        })
    }
    //console.log(decoded)//{ id: '699706710ae12f89b97ca555', iat: 1771505265, exp: 1771591665 }
    
    //Find posts of that user on the basis of userId
    const post = await postModel.find({
        userId:decoded.id
    })

    res.status(200).json({
        message:"Post fetch successfully",
        post
    })
   

}







// GET /api/post/details/:postId
// Controller to get single post details
// User request karega post details ke liye
// Agar post usi user ne create ki hai (token se verify hoga)
// tabhi usko post ki details dikhegi
async function getPostDeatilsController(req, res) {

    // 🔹 Step 1: Cookie se JWT token lena
    const token = req.cookies.JWT_TOKEN

    // 🔹 Agar token hi nahi mila to unauthorized
    if (!token) {
        return res.status(401).json({
            message: "Token not provided, Unauthorized access"
        })
    }

    let decoded
    // 🔹 Step 2: Token verify karna (check karo ye token humare server ne tu bnaya hai na aur expirey of token)
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    }
    catch (error) {
        // Agar token invalid ya expired hai
        return res.status(401).json({
            message: "Invalid token"
        })
    }

    // 🔹 decoded object me user ki id milti hai-->ye data vo hai jo token create krte time jwt.sign() me dala tha  
    console.log(decoded)// { id: '699706710ae12f89b97ca555', iat: ..., exp: ... }

    // 🔹 URL params se postId lena
    // /api/post/details/699706060ae12f89b97ca550
    console.log(req.params)

    let pId = req.params.postId      // post ka id
    let userId = decoded.id          // token se nikla hua user id

    // 🔹 Step 3: Database se post find karna using postId
    const post = await postModel.findById(pId)

    console.log("Post", post)

    // 🔹 Agar post exist hi nahi karti
    if (!post) {
        return res.status(404).json({
            message: "Post not found"
        })
    }

    console.log("pID =", pId)
    console.log("userId", post.userId)

    // 🔹 Step 4: Check karna ki post jis user ki hai
    // kya wahi user request kar raha hai?
    // ObjectId compare karne ke liye string me convert karna padta hai
    let isValidUser = (post.userId.toString() == userId.toString())

    // 🔹 Agar post kisi aur user ki hai → access deny
    if (!isValidUser) {
        return res.status(403).json({   // 403 more correct than 404
            message: "Forbidden content"
        })
    }

    // 🔹 Agar sab valid hai to post details return karo
    res.status(200).json({
        message: "Post details fetch successfully",
        post
    })

}










// Controller export
module.exports = {
    createPostController,
    getPostController,
    getPostDeatilsController
}
