const Post = require('../models/post').Post;
const User = require('../models/user');

const getAllPosts = async (req, res) => {
    var vm = [];
    var posts = await Post.find({ userid: req.user.userid });
    posts.forEach(post => {
        vm.push({
            Id: post._id,
            Title: post.title,
            Body: post.body,
            LikeCount: post.likes.length,
            IsTask: post.isTask,
            CommentCount: post.comments.length,
            CreatedAt: post.createat
        })
    });
    res.json(vm)
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
    var userId = req.user.userid;
    const post = await Post.findById(req.params.id).where({ userid: userId });
    if (post == null) {
        res.json({ status: false, msg: "Post not found" });
        return;
    }
    var comments=[];
    for (const comment of post.comments) {
        var commentUser = await User.findById(comment.userid).select("firstName lastName");
        comments.push({
            CommnetId: comment._id,
            Text: comment.text,
            Likes: comment.likes.length,
            CommentUser: commentUser.firstName + " " + commentUser.lastName,
            CommentUserId: commentUser._id,
            CreatedAt: comment.createat
        });
    };
    res.json({
        Id: post._id,
        Title: post.title,
        Body: post.body,
        LikeCount: post.likes.length,
        IsTask: post.isTask,
        Comments: comments,
        CreatedAt: post.createat
    });
}

const updatePost = async (req, res) => {
    var data = req.body;
    var userId = req.user.userid
    const post = await Post.findById(req.params.id).where({ userid: userId });
    if (post == null) {
        res.json({ status: false, msg: "Post not found" });
        return;
    }
    if (data.Title != "" || data.Title != null) {
        post.title = data.Title;
    }
    if (data.Body != "" || data.Body != null) {
        post.body = data.Body;
    }
    post.save();
    res.json({ status: true, msg: "Post updated" })
}

const publishPost = async (req, res) => {
    var userId = req.user.userid
    const post = await Post.findById(req.params.id).where({ userid: userId });
    if (post == null) {
        res.json({ status: false, msg: "Post not found" });
        return
    }
    var newStatus = !post.isTask;
    post.isTask = newStatus;
    post.save();
    if (newStatus) {
        res.json({ status: true, msg: "Post unpublished" })
    } else {
        res.json({ status: true, msg: "Post published" })
    }
}

const deletePost = async (req, res) => {
    var userId = req.user.userid
    await Post.where({ userid: userId }).findById(req.params.id).deleteOne()
        .then(() => {
            res.json({ status: true, msg: "Post deleted" })
        }).catch((err) => {
            console.log(err);
            res.status(400).json({ status: false, msg: "Post delete error" });
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