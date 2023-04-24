const express = require('express')
const router=express.Router();
const auth=require("../middleware/auth")

const {
    login,
    register,
    updateProfile
}=require('../controllers/home')

router.route("/").get(login).post(register);
router.patch("/", auth, updateProfile);
module.exports=router;