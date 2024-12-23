const express = require("express");
const path = require("path");
const ejs = require('ejs')
const mongoose = require('mongoose')
const userRoute = require("./routes/user")

const app = express();
const PORT=8003;

mongoose.connect('mongodb://127.0.0.1:27017/blog')
.then((e)=> console.log("MongoDB Connected"))

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

app.use(express.urlencoded({extended:false}));

app.get('/',(req,res)=>{
    res.render("home");
});

app.use('/',userRoute);



app.listen(PORT, ()=> console.log(`Server stated at http://localhost:${PORT}`));