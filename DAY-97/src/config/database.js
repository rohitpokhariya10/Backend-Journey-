const mongoose = require("mongoose")

function connectToDb(){
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("Database Connected Successfully")
    })
    .catch((error)=>{
        console.log("Database Error" , error)
    })
}
module.exports = connectToDb