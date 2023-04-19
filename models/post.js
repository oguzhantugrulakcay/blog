const mongoose=require('mongoose');

const PostSchema=new mongoose.Schema({
    title:String,
    body:String,
    isTask:Boolean
})

module.exports=mongoose.model("Post",PostSchema)