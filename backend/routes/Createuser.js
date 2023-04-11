const express = require('express');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const route = express.Router();
const user = require('../modules/Userschema');
const multer = require('multer')
const path = require('path')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname))
  }
})
const upload = multer({ storage: storage })
route.post('/createuser', upload.single('image'),
  // username must be an email
  body('email', 'please enter valid email').isEmail(),
  // password must be at least 5 chars long
  body('password', 'please enter valid password').isLength({ min: 5 }),
  async (req, res) => {
    try {
      console.log(req.file);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const salt = await bcrypt.genSalt(10);
      const saltedpassword = await bcrypt.hash(req.body.password, salt);
      await user.create({
        name: req.body.name,
        email: req.body.email,
        password: saltedpassword,
        user_type: req.body.user_type,
        secure_phase: req.body.secure_phase,
        image: req.file.filename
      })
      res.json({ success: true, message: "user inserted succesfully" })
    } catch (error) {
      console.log(error);
      res.json({ success: false })
    }
  })






module.exports = route;