const express=require('express');
const route=express.Router();
const user=require('../modules/Userschema');
var nodemailer = require('nodemailer');
route.post('/sendlink',(req,res)=>{
//console.log(req.body);
let {email}=req.body;
user.findOne({email:email})
.then(resp=>{
    const {_id}=resp
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'subhasis.pasdigital@gmail.com',
          pass: 'gzhzhjpavokeyppc'
        }
      });
      let mailOptions = {
        from: 'subhasis.pasdigital@gmail.com',
        to: email,
        subject: 'Sending Email using Node.js',
        text: `here is your link http://localhost:5173/forgotpassword/${_id}`
      };
      
      transporter.sendMail(mailOptions)
      .then(mailres=>{res.status(200).json({sucess:true,message:"email send successfully",data:mailres.response})})
      .catch(err=>{res.status(200).json({sucess:false,message:err.message})});
})
    .catch(cat=>{res.status(200).json({sucess:false,message:cat.message})});

})
module.exports=route;