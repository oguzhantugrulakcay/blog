const mongoose=require('mongoose');

const CommentSchema=new mongoose.Schema({
    userid:{type:mongoose.Schema.Types.ObjectId, ref: 'User'},
    text:{type:String, require:true},
    likes:[{type:mongoose.Schema.Types.ObjectId, ref: 'User'}],
    createat:{type:Date,default:Date.now},
})

const PostSchema=new mongoose.Schema({
    title:String,
    body:String,
    isTask:{type:Boolean, default:true},
    likes: [{type:mongoose.Schema.Types.ObjectId, ref: 'User'}],
    userid:{type:mongoose.Schema.Types.ObjectId, ref: 'User'},
    comments:[CommentSchema],
    createat:{type:Date, default:Date.now},
})

const Post = mongoose.model('Post', PostSchema);
const Comment = mongoose.model('Comment', CommentSchema);

module.exports = { Post, Comment };