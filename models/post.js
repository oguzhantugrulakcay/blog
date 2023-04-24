const mongoose=require('mongoose');

const CommentSchema=new mongoose.Schema({
    userid:{type:mongoose.Schema.Types.ObjectId, ref: 'User'},
    text:{type:String, require:true},
    likes:{type:Number,default:0},
    createat:{type:Date,default:Date.now},
})

const PostSchema=new mongoose.Schema({
    title:String,
    body:String,
    isTask:{type:Boolean, default:false},
    likes: {type:Number,default:0},
    userid:{type:mongoose.Schema.Types.ObjectId, ref: 'User'},
    comments:CommentSchema,
    createat:{type:Date, default:Date.now},
})



module.exports=mongoose.model("Post",PostSchema)
module.exports=mongoose.model("Comment",CommentSchema)