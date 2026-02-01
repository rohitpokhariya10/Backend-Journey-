// server ko start krna
// database se connect krna


require("dotenv").config()
const app = require("./src/app")
//require connectTODb dunction from config/database.js file
const connectToDb = require("./src/config/database")

//server start
app.listen(3000 , ()=>{
    console.log("Server is running on port 3000");
    
})

//Function call
connectToDb()