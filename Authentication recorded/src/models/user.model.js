const mongoose = require("mongoose")

//user Schema create
const userSchema = new mongoose.Schema({
    name:String,
    email:{
        type:String,
        unique:["true","User email aldready exist...."]
    },
    password:String
})

//userSchema ka model create kara
const userModel = mongoose.model("user2",userSchema)

module.exports = userModel