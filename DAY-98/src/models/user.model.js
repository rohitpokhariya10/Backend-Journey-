const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name:String ,
     email :{
        type:String,
        unique:["true" , "user already exist with this email..."]

    }, 
    password:String
})

const userModel = mongoose.model("user2" , userSchema)

module.exports =  userModel