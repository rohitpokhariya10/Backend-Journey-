const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true , "Username required"],
        unique:[true , "Username already exist"]
    },
    email:{
        type:String,
        unique:[true , "user email already exist"]
    },
    password:{
        type:String,
        required:[true , "Password required"]
    },
    bio:String,
    profileImage:{
        type:String,
        default:"https://ik.imagekit.io/uosvj5zwr3/Instagram%20clone/74a3b6a8856b004dfff824ae9668fe9b.webp?updatedAt=1770871625811"
    }
})


const userModel = mongoose.model("user", userSchema)

module.exports = userModel