require("dotenv").config()//isko sabse top me likhte hai
const app = require("./src/app")
const connectToDb =require("./src/config/database")


app.listen(3000 , ()=>{
    console.log("Server is running on port 3000")
})

connectToDb()//mongodb database connection