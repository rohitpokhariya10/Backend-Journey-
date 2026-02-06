require("dotenv").config()//dotenv ko sbse pheleconfigure kro tabhi tuh env variables sabko milenge phele se hi
const app = require("./src/app")

const connectToDb = require("./src/config/database")


app.listen(3000 , ()=>{
    console.log("Server is running on port 3000")
})

//function
connectToDb()
