const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name:String,
    password:String,
    email:{
        type:String,
        unique:["true" , "User already exist with this emaillllll..."]
    }

})

const userModel = mongoose.model("user" , userSchema)

module.exports = userModel