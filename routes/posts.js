const express = require('express')
const router=express.Router();
const auth=require("../middleware/auth")
const {
    getAllPosts,
    getPost,
    likePost,
    addComment,
    editComment,
    likeComment,
    deleteComment,
    getUserPosts
}=require('../controllers/posts')

router.get("/",auth,getAllPosts)
router.route("/:id").get(auth,getPost).post(auth,addComment).put(auth,likePost)
router.route("/:id/:commentid").post(auth,likeComment).put(auth,editComment).delete(auth,deleteComment)
router.route("/:id/user").get(auth,getUserPosts)

module.exports=router;