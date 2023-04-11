const express = require('express');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const route = express.Router();
const user = require('../modules/Userschema');

route.post('/forgotpassword',
    // username must be an email
    body('email', 'please enter valid email').isEmail(),
    // password must be at least 5 chars long
    async (req, res) => {
        const { reset_password, confirm_password } = req.body
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, message: "Error Occured !", data: userDetails, errors: errors.array() });
            }
            const email = req.body.email;
            user.findOne({ email: email }, async (err, result) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(result)
                    const { id } = result;
                    if (req.body.secure_phase !== result.secure_phase) {
                        return res.status(400).json({ errors: "user not found" });
                    }
                    else if (reset_password !== confirm_password) {

                        res.json({ success: false, message: "match ur password" })


                    }
                    else {
                        const salt = await bcrypt.genSalt(10);
                        const saltedpassword = await bcrypt.hash(reset_password, salt);
                        user.findByIdAndUpdate(id, {
                            password: saltedpassword
                        }, { new: true }).then(response => { res.json({ success: true, data: response, message: "your data successfully updated" }) })
                            .catch(cat => { res.json({ success: false, data: cat.message }) })

                    }
                }
            });




        } catch (error) {
            console.log(error);
            res.json({ success: false })
        }
    })
module.exports = route;