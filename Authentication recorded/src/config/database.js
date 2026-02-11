const mongoose = require("mongoose")

const connectToDb= async ()=>{
   await mongoose.connect(process.env.MONGO_URI)
    try{  
        console.log("Database connceted Successfully")
    }
    catch(error){
        console.log("Database connection error",error)
    }
   
}

module.exports = connectToDb