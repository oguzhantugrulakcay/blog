const express = require('express')
const router=express.Router();

const {
    getAllPosts,
    createPost,
    getPost,
    updatePost,
    publishPost,
    deletePost
}=require('../controllers/posts')

router.route("/").get(getAllPosts).post(createPost)
router.route("/:id").get(getPost).patch(updatePost).delete(deletePost).put(publishPost)

module.exports=router;