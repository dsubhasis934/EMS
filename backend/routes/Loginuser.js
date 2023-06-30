const express = require('express');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const route = express.Router();
const user = require('../modules/Userschema');
const jwt = require('jsonwebtoken');
const jwtSecret = "pasdigitaltechnology";
//const bcrypt=require('bcrypt');
route.post('/loginuser',
    // username must be an email
    (req, res) => {
        const { email, password } = req.body;
        user.find({ email: email })
            .then(resp => {
                if (resp.length === 1) {
                    bcrypt.compare(password, resp[0].password)
                        .then(result => {
                            result ?
                                jwt.sign(
                                    { name: resp[0].name, email: resp[0].email, user_type: resp[0].user_type, _id: resp[0]._id },
                                    jwtSecret,
                                    { expiresIn: '12h' },
                                    (error, token) => {
                                        error ? res.status(200).json({ success: false, message: "Error Occured !", error })
                                            : res.status(200).json({ success: true, message: "User loggedin", token, name: resp[0].name, _id: resp[0]._id })
                                    }) : res.status(200).json({ success: false, message: "Credential Mismatched !" })
                        })
                        .catch(err => res.status(200).json({ success: false, message: 'Error Occured !', error: err.message }))
                } else {
                    res.status(200).json({ success: false, message: "Credential Mismatched !" })
                }
            })
    })
module.exports = route;