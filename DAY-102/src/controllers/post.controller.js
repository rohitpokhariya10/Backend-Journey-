const postModel = require("../models/post.model")
const monhgoose = require("mongoose")
const imageKit = require("@imagekit/nodejs")


// const imageKit = imageKit({
//    privateKey:process.env.IMAGEKIT_PRIVATE_KEY
// })





const createPostController = async (req,res)=>{
  console.log(req.body) //[Object: null prototype] { caption: 'Radha Radha' }
  console.log(req.files)//files array of objects me ayegi
}






module.exports = {createPostController}