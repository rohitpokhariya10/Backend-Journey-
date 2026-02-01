//db se kese connect krenge vo code yha likhte hai

const mongoose = require("mongoose")

function connectToDb(){
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("DB connected Successfully");
        
    })
    .catch((err) =>{
      console.log("DB connection Failed",err);
      
    })
}

//export connectToDb function
module.exports = connectToDb