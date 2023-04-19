const Post=require("../models/post")

const getAllPosts=(req,res)=>{
    res.send('All items')
}

const createPost=(req,res)=>{
    res.json(req.body)
}

const getPost=(req,res)=>{
    res.json({id:req.params.id})
}

const updatePost=(req,res)=>{
    res.send("Post Updated")
}

const publishPost=(req,res)=>{
    res.send("Post Published")
}

const deletePost=(req,res)=>{
    res.send("Post Deleted")
}

module.exports={
    getAllPosts,
    createPost,
    getPost,
    updatePost,
    publishPost,
    deletePost
}