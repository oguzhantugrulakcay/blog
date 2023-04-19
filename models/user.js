const mongoose=require('mongoose');

const UserSchema=new mongoose.Schema({
    email:{
        type:String,
        lowercase: true,
        index: true,
        unique: true
    },
    password:String,
    fullname:String
})

module.exports=mongoose.model("User",UserSchema)