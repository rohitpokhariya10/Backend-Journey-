require("dotenv").config()
const app = require("./src/app")
const connectToDb = require("./src/config/database")

app.listen(3000 , ()=>{
    console.log("server is running on port 3000")
})


//Database connection call
connectToDb()