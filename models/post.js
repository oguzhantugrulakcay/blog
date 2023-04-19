const mongoose=require('mongoose');

const PostSchema=new mongoose.Schema({
    title:String,
    body:String,
    isTask:{type:Boolean, default:false},
    postUser:{type:mongoose.Schema.Types.ObjectId, ref: 'User'}
})

module.exports=mongoose.model("Post",PostSchema)