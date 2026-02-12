const mongoose = require("mongoose")

const connectToDb= async ()=>{
   try{
    await mongoose.connect(process.env.MONGO_URI)
   console.log("Database connected successfully")
   }
   catch(error){
    console.log("Database Connection Failed",error)
   }
}

//export this function kyunki ise server.js me call krenge (this is a standard formst to write a code)
module.exports=connectToDb