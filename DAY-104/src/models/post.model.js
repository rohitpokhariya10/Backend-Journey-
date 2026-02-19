const mongoose = require("mongoose")
const userModel = require("../models/user.model")

const postSchema = new mongoose.Schema({
    //this validation is only for database point of view
    caption:{
        type:String,
         default:""
    },
    imageUrl:{
        type:String,
        required:[true , "imgurl is required"],
     
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",//user ki id hum user collection se lenge vo bta rhe hain
        required:[true , "user id is required for creating a post"]
    },
    createdAt:{
        type:Date
    }
})

const postModel = mongoose.model("post" , postSchema)


module.exports = postModel