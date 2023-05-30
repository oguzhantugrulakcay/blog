const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const dbContext=require("../db/connect")

const login = async (req, res) => {
    dbContext.query(`Select * from users where email='${req.body.Email}'`,(err,dbRes)=>{
        if(err!=null){
            console.log(`DB query error:${err.message}`)
            res.json({ status: false, msg: err.message });
        }else{
            if(dbRes.rowCount!=1){
                res.json({ status: false, msg: "Email or password is not correct, please check it"});  
            }else{
                if (bcrypt.compare(req.body.Password, dbRes.rows[0].password)) {
                    var token = jwt.sign(
                        { userid: dbRes.rows[0].user_id, email: dbRes.rows[0].email },
                        process.env.SECRET_KEY,
                        {
                            expiresIn: "2h",
                        })
                    res.json({ status: true, msg: "Login success", val: token })
                } else {
                    res.json({ status: false, msg: "Email or password is not correct, please check it" })
                }
            }
        }
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
    dbContext.query(`Insert Into users (email,first_name,last_name,password) values ('${user.Email}','${user.FirstName}','${user.LastName}','${hashPassword}') RETURNING *`,(err,dbRes)=>{
        if(err!=null){
            console.log(`DB query error:${err.message}`)
            res.json({ status: false, msg: err.message });
        }else{
            var justUser=dbRes.rows[0];
            var token = jwt.sign(
                { userid: justUser._id, email: justUser.email },
                process.env.SECRET_KEY,
                {
                    expiresIn: "2h",
                }
            );
            res.json({ status: true, msg: "Kullanıcı oluşturuldu.", val: token })
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
    dbContext.query(`Update users set email='${data.Email}',first_name='${data.FirstName}',last_name='${data.LastName}',password='${hashPassword}' where user_id=${req.user.userid} RETURNING *`,(err,dbRes)=>{
        if(err!=null){
            console.log(`DB query error:${err.message}`)
            res.json({ status: false, msg: err.message });
        }else{
            res.json({status:true,msg:"Profile updated"})
        }
    })
};

module.exports = {
    login,
    register,
    updateProfile
}