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

router.get("/",auth).get(getAllPosts).post(createPost)
router.route("/:id",auth).get(getPost).post(updatePost).delete(deletePost).put(publishPost)

module.exports=router;