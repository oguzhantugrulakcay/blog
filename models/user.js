const mongoose=require('mongoose');
const Post=require('./post')

const UserSchema=new mongoose.Schema({
  firstName: { type: String, default: null },
  lastName: { type: String, default: null },
  email: { type: String, unique: true },
  password: { type: String }
})

module.exports=mongoose.model("User",UserSchema)