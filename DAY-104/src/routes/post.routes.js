const express = require("express")
const postRouter = express.Router()//create mini server
const postController = require("../controllers/post.controller")
 //multer read files from req
 const multer = require("multer")
 const upload = multer({storage: multer.memoryStorage()})



//POST /api/post/   
//req.body me {caption , imgUrl} ayega
//this is protected route --> means only the valid user can access this route those have a valid token
postRouter.post("/",upload.single("image"), postController.createPostController)

postRouter.get('/' , postController.getPostController)

postRouter.get('/details/:postId' , postController.getPostDeatilsController)














module.exports = postRouter