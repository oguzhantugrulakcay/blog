const express = require('express')
const router=express.Router();
const auth=require("../middleware/auth")
const {
    getAllPosts,
    getPost,
}=require('../controllers/posts')

router.get("/",auth,getAllPosts)
router.route("/:id",auth).get(getPost)

module.exports=router;