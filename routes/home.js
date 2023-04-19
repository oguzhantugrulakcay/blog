const express = require('express')
const router=express.Router();

const {
    login,
    register
}=require('../controllers/home')

router.route("/").get(login).post(register)

module.exports=router;