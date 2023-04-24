const Post = require('../models/post');
const User = require('../models/user');

const getAllPosts =async (req, res) => {
    await Post.where({isTask:false}).find()
    .then((posts)=>{
        res.json(posts)
    }).
    catch(()=>{
        res.status(404).json({status:false,msg:"Post not found"})
    })
}

const getPost = async (req, res) => {
    await Post.findById(req.params.id).
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

module.exports = {
    getAllPosts,
    getPost,
}