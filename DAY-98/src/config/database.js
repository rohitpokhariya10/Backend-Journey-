const mongoose = require("mongoose")


function connectTODb(){
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("Databaser connected successfully")
    })
    .catch((error)=>{
        console.log("Database  connection error" , error)
    })
}

module.exports =  connectTODb