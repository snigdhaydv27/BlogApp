const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullName:{
        tyepe: String,
        required: true, 
    }
});