const express = require("express")
const postRouter = express.Router()//create mini server
const postController = require("../controllers/post.controller")
 //
 const multer = require("multer")
 const upload = multer({storage: multer.memoryStorage()})



//POST /api/posts/   
//req.body me {caption , imgUrl} ayega
//this is protected route --> means only the valid user can access this route those have a valid token
postRouter.post("/",upload.array("t1",2), postController.createPostController)















module.exports = postRouter