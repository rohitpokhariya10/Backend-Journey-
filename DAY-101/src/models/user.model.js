const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
    {
        username:{
            type:String,
            unique:[true, "Username already exist"],
            required:[true , "username is required"]//required means username field honi chiye and user ko kuch input mandatory dalna hi hoga

        },
        
        email:{
            type:String,
            unique:[true,"user already exist with this email"]
        },
        password:{
            type:String,
            required:[true , "password is required"]
        },
        bio:String,
        profileImage:{
            type:String,
            //imagekit.io cloud service me default profile picture upload kri hai and usne hume us image ka url diya hai because 
            //hum database me direct image nhi store kar skte hai
            default:"https://ik.imagekit.io/uosvj5zwr3/Instagram%20clone/74a3b6a8856b004dfff824ae9668fe9b.webp"
        }

    }
)

const userModel = mongoose.model("user",userSchema)


module.exports=userModel