const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const login = async (req, res) => {
    await User.findOne({email:req.body.Email})
    .then((user)=>{
        if(user==null){
            res.json({ status: false, msg: "Email or password is not correct, please check it"});
            return
        }
        if (bcrypt.compare(req.body.Password, user.password)) {
                var token = jwt.sign(
                    { userid: user._id, email: user.email },
                    process.env.SECRET_KEY,
                    {
                        expiresIn: "2h",
                    })
                res.json({ status: true, msg: "Login success", val: token })
            } else {
                res.json({ status: false, msg: "Email or password is not correct, please check it" })
            }
    }).catch((err)=>{
        console.log(err);
    })

}

const register = async (req, res) => {
    var user = req.body
    if (user.Email == "") {
        res.json({ status: false, msg: "Email is required" })
    }
    if (user.FirstName == "" || user.FirstName == null) {
        res.json({ status: false, msg: "First name is required" })
    }
    if (user.LastName == "" || user.LastName == null) {
        res.json({ status: false, msg: "Last name is required" })
    }
    if (user.Password == "" || user.Password == null) {
        res.json({ status: false, msg: "Password is required" })
    }
    if (user.Password != user.PasswordAgain) {
        res.json({ status: false, msg: "Passwords are not same" })
    }
    var hashPassword = await bcrypt.hash(user.Password, 10);
    User.create({ email: user.Email, firstName: user.FirstName, lastName: user.LastName, password: hashPassword})
        .then((justUser) => {
            var token = jwt.sign(
                { userid: justUser._id, email: justUser.email },
                process.env.SECRET_KEY,
                {
                    expiresIn: "2h",
                }
            );
            // save user token
            user.token = token;
            res.json({ status: true, msg: "Kullanıcı oluşturuldu.", val: justUser._id })
        }
        )
        .catch((err) => {
            if (err.code === 11000 && err.keyPattern && err.keyPattern.email === 1) {
                res.json({ status: false, msg: "Bu e-posta adresi zaten kullanılıyor." });
            } else {
                res.status(500).json({ status: false, msg: "Bu e-posta adresi zaten kullanılıyor.", val: err.message });
            }
        })
};

const updateProfile=async (req,res)=>{
    var data = req.body
    if (data.Email == "") {
        res.json({ status: false, msg: "Email is required" })
    }
    if (data.FirstName == "" || data.FirstName == null) {
        res.json({ status: false, msg: "First name is required" })
    }
    if (data.LastName == "" || data.LastName == null) {
        res.json({ status: false, msg: "Last name is required" })
    }
    if (data.Password == "" || data.Password == null) {
        res.json({ status: false, msg: "Password is required" })
    }
    if (data.Password != data.PasswordAgain) {
        res.json({ status: false, msg: "Passwords are not same" })
    }
    var hashPassword = await bcrypt.hash(data.Password, 10);
    await User.findById(req.user.userid).updateOne({firstName:data.FirstName,lastName:data.LastName,password:hashPassword,email:data.Email}).
    then(()=>{
        res.json({status:true,msg:"Profile updated"})
    })
    .catch((err) => {
        if (err.code === 11000 && err.keyPattern && err.keyPattern.email === 1) {
            res.json({ status: false, msg: "Bu e-posta adresi zaten kullanılıyor." });
        } else {
            res.status(400).json({ status: false, msg: "Profile update error"});
        }
    })
};

module.exports = {
    login,
    register,
    updateProfile
}