const mongoose = require("mongoose");
const {createHmac, randomBytes} = require("node:crypto")

const userSchema = new mongoose.Schema({
    fullName:{
        tyepe: String,
        required: true, 
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    salt:{
        type:String,
    }
    ,
    password:{
        type:String,
        requied:true
    },
    profileImageURL:{
        type:String,
        default:'/images/default.png',
    },
    role:{
        type:String,
        enum:["USER","ADMIN"],
        default:"USER",
    }
},{timestamp: true});

userSchema.pre('save', function(next){
    const user = this;
    if(!user.isModified("password")) return;
    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256',salt)
    .update(user.password)
    .digest("hex");
    this.salt = salt;
    this.password=hashedPassword;

})

const User = new mongoose.model("user", userSchema);

module.exports =User;