const mongoose = require("mongoose")
function connectToDb() {
    mongoose.connect("mongodb+srv://rohitpokhariya123_db_user:mjsHSsPA9wkd4Q0o@cluster0.c4vw2fh.mongodb.net/day-7")
        .then(() => {
            console.log("Database Connected Successfully");

        })
        .catch((err) => {
            console.log("Connection failed", err);

        })
}


module.exports = connectToDb