const Post = require('../models/post').Post;
const User = require('../models/user');
const Comment = require('../models/post').Comment;

const getAllPosts = async (req, res) => {
    var vm = [];
    var posts = await Post.find({ isTask: false }).sort({ createat: -1 });
    for (const post of posts) {

        var postUser = await User.findById(post.userid).select("firstName lastName");
        vm.push({
            Id: post._id,
            Title: post.title,
            Body: post.body,
            CommentCount: post.comments.length,
            PostUser: postUser.firstName + " " + postUser.lastName,
            LikeCount: post.likes.length,
            CreatedAt: post.createat
        })
    };
    res.json(vm);

}

const getPost = async (req, res) => {
    var post = await Post.findById(req.params.id).where({ isTask: false });
    if (post == null) {
        res.json({ status: false, msg: "Post not found" })
        return;
    }
    var comments = [];
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
    var postUser = await User.findById(post.userid).select("firstName lastName");
    res.json({
        Id: post._id,
        Title: post.title,
        Body: post.body,
        Comment: comments.sort((a, b) => b.CreatedAt - a.CreatedAt),
        PostUser: postUser.firstName + " " + postUser.lastName,
        LikeCount: post.likes.length,
        CreatedAt: post.createat
    })
}

const likePost = async (req, res) => {
    var userId = req.user.userid
    var post = await Post.findById(req.params.id).where({ isTask: false });
    if (post == null) {
        res.json({ status: false, msg: "Post not found" })
        return;
    }
    if (post.likes.includes(userId)) {
        const index = post.likes.indexOf(userId);
        post.likes.splice(index, 1)
        post.save();
        res.json({ status: true, msg: "Liked removed" });
    } else {
        post.likes.push(req.user.userid)
        post.save();
        res.json({ status: true, msg: "Post liked" });
    }

}

const addComment = async (req, res) => {
    var data = req.body;
    var userId = req.user.userid
    var post = await Post.findById(req.params.id).where({ isTask: false });
    if (post == null) {
        res.json({ status: false, msg: "Post not found" })
        return;
    }
    var justComment = new Comment({
        text: data.Text,
        userid: userId
    });
    post.comments.push(justComment);
    await post.save();
    res.json({ status: true, msg: "Comment added", val: justComment });
}
const editComment = async (req, res) => {
    var text = req.body.Text;
    if (text == "" || text == null) {
        res.json({ status: false, msg: "Commnet text required" });
        return;
    }
    var post = await Post.findById(req.params.id).where({ isTask: false });
    if (post == null) {
        res.json({ status: false, msg: "Post not found" })
        return;
    }
    const comment = post.comments.id(req.params.commentid);
    if (comment == null) {
        res.json({ status: false, msg: 'Comment not found' });
        return;
    }
    comment.text = text;
    post.save();

    res.json({ status: true, msg: "Comment editted", val: text });
}
const likeComment = async (req, res) => {
    var userId = req.user.userid
    var post = await Post.findById(req.params.id).where({ isTask: false });
    if (post == null) {
        res.json({ status: false, msg: "Post not found" })
        return;
    }
    const comment = post.comments.id(req.params.commentid);
    if (comment == null) {
        res.json({ status: false, msg: 'Comment not found' });
        return;
    }
    if (comment.likes.includes(userId)) {
        const index = post.likes.indexOf(userId);
        comment.likes.splice(index, 1)
        post.save();
        res.json({ status: true, msg: "Liked removed" });
    } else {
        comment.likes.push(req.user.userid)
        post.save();
        res.json({ status: true, msg: "Comment liked" });
    }
}
const deleteComment = async (req, res) => {
    var post = await Post.findById(req.params.id).where({ isTask: false });
    if (post == null) {
        res.json({ status: false, msg: "Post not found" })
        return;
    }
    const comment = post.comments.id(req.params.commentid);
    if (comment == null) {
        res.json({ status: false, msg: 'Comment not found' });
        return;
    }
    await comment.deleteOne();
    post.save();
    res.json({ status: true, msg: 'Comment deleted' });
}

const getUserPosts = async (req, res) => {
    var model = [];
    var user=await User.findById(req.params.id);
    var posts = await Post.find({ userid: req.params.id });
    posts.forEach(post => {
        var comments = [];
        post.comments.forEach(comment => {
            var commentUser = User.findById(comment.userid);
            comments.push({
                Text: comment.text,
                CommentUser: commentUser.firstName + " " + commentUser.lastName,
                CommentUserId: commentUser._id,
                CreatedAt: comment.createat
            });
        });
        model.push({
            Id: post._id,
            Title: post.title,
            Body: post.body,
            LikeCount: post.likes.length,
            IsTask: post.isTask,
            CommentCount: comments.length,
            CreatedAt: post.createat
        })
    });
    res.json({
        FirtName:user.firstName,
        LastName:user.lastName,
        Posts:model
    })
}

module.exports = {
    getAllPosts,
    getPost,
    likePost,
    addComment,
    editComment,
    deleteComment,
    likeComment,
    getUserPosts
}