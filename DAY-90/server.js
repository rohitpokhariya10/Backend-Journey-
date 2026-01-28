const app = require("./src/app")
const mongoose = require("mongoose")

function connectToDb(){
       mongoose.connect("mongodb+srv://rohitpokhariya123_db_user:<password>@cluster0.c4vw2fh.mongodb.net/day-90")
       .then(()=>{
        //connect hone pe message print hota hai
        console.log("Connected to DB"); 
    })
       .catch(()=> console.log("DB Connection failed " , err));
}
connectToDb()
app.listen(3000, ()=>{
    console.log("Server is running on port no 3000");
    
})

