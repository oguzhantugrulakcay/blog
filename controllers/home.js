const User = require("../models/user")
const bcrypt = require('bcrypt');

const login = async (req, res) => {
    User.find({email:req.body.Email})
    .then((user)=>{
        if (bcrypt.compare(req.body.Password+process.env.SECRET_KEY,user.password)){
            res.json({status:true,msg:"Giriş Başarılı",val:user})
        }else{
            res.json({status:false,msg:"Kullanıcı email veya şifre hatalı, lütfen kontrol ediniz."})
        }
        
    })
    .catch((err)=>{
        res.json({status:false,msg:"Kullanıcı email veya şifre hatalı, lütfen kontrol ediniz."})
    }
    )
}

const register = async (req, res) => {
    var user = req.body;
    if(user.Email==""){
        res.json({status:false,msg:"Mail adresi boş bırakılamaz"});
    }
    if (user.Fullname==""){
        res.json({status:false,msg:"Ad soyad boş bırakılamaz"});
    }
    if(user.Password==""){
        res.json({status:false,msg:"Şifre boş bırakılamaz lütfen kkontrol ediniz!"})
    }
    if(user.Password!=user.PasswordAgain){
        res.json({status:false,msg:"Şifreler birbirleri ile uyuşmuyor!"})
    }
    var hashPassword= await bcrypt.hash(user.Password+process.env.SECRET_KEY, 10);
    User.create({email: user.Email,fullname: user.Fullname,password:hashPassword})
    .then((justUser)=>{
        res.json({status:true,msg:"Kullanıcı oluşturuldu.",val:justUser._id})
    }
    )
    .catch((err)=>{
        if (err.code === 11000 && err.keyPattern && err.keyPattern.email === 1) {
            res.json({status:false, msg: 'Bu e-posta adresi zaten kullanılıyor.' });
          } else {
            res.status(500).json({status:false, msg: 'Bu e-posta adresi zaten kullanılıyor.', val: err.message });
          }
    })
};

module.exports = {
    login,
    register
}