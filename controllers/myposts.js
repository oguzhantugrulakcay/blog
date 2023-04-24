const Post = require('../models/post');
const User = require('../models/user');

const getAllPosts = async (req, res) => {
    await Post.where({userid:req.user.userid}).find()
    .then((posts)=>{
        res.json(posts)
    })
    .catch(()=>{
        console.log(err);
        res.status(400).json({status:false,msg:"Post list error"});
    })
}

const createPost = async (req, res) => {
    var post = req.body
    if (post.Title == "" || post.Title == null) {
        res.json({ status: false, msg: "Post title required" })
    }
    if (post.Body == "" || post.Body == null) {
        res.json({ status: false, msg: "Post body required" })
    }

    const newPost = {
        title: post.Title,
        body: post.Body,
        userid: req.user.userid
    };
    await Post.create(newPost).
        then((post) => {
            res.json({ status: true, msg: "Post created", val: post._id })
        }).
        catch((err) => console.log(err))
}

const getPost = async (req, res) => {
    var userId=req.user.userid;
    await Post.where({userid:userId}).findById(req.params.id).
        then((post) => {
            User.findById(post.userid).
            then((user)=>{
                res.json({
                    Title: post.title,
                    Body: post.body,
                    User: user.firstName + " " + user.lastName,
                    Likes: post.likes,
                    IsTask: post.isTask
                })
            });
        }).
        catch((err) => {
            res.status(404).json({status:false,msg:"Post not found"})
        })
}

const updatePost =async (req, res) => {
    var data=req.body;
    var userId=req.user.userid
    await Post.where({userid:userId}).findById(req.params.id).updateOne({title:data.Title,body:data.Body}).
    then(()=>{
        res.json({status:true,msg:"Post updated"})
    }).
    catch((err)=>{
        console.log(err);
        res.status(400).json({status:false,msg:"Post update error"});
    })
}

const publishPost =async (req, res) => {
    var data=req.body;
    var userId=req.user.userid
    await Post.where({userid:userId}).findById(req.params.id).updateOne({isTask:data.IsTask}).
    then(()=>{
        if(data.IsTask){
            res.json({status:true,msg:"Post unpublished"})
        }else{
            res.json({status:true,msg:"Post published"})
        }
        
    }).
    catch((err)=>{
        console.log(err);
        res.status(400).json({status:false,msg:"Post update error"});
    })
}

const deletePost =async (req, res) => {
    var userId=req.user.userid
    await Post.where({userid:userId}).findById(req.params.id).deleteOne()
    .then(()=>{
        res.json({status:true,msg:"Post deleted"})
    }).catch((err)=>{
        console.log(err);
        res.status(400).json({status:false,msg:"Post delete error"});
    })
    
}

module.exports = {
    getAllPosts,
    createPost,
    getPost,
    updatePost,
    publishPost,
    deletePost
}