const express = require('express')
const router=express.Router();
const auth=require("../middleware/auth")
const {
    getAllPosts,
    createPost,
    getPost,
    updatePost,
    publishPost,
    deletePost
}=require('../controllers/myposts')

router.route("/").get(auth,getAllPosts).post(auth,createPost)
router.route("/:id").get(auth,getPost).post(auth,updatePost).delete(auth,deletePost).put(auth,publishPost)

module.exports=router;