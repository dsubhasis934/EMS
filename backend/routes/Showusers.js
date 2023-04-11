const express = require('express');
const mongoose = require('mongoose');
const route = express.Router();
const user = require('../modules/Userschema');
const jwt = require('jsonwebtoken');
const jwtSecret = "pasdigitaltechnology";
route.get('/showusers', async (req, res) => {
    //here we destructing with req.query because we pass 'sort and field' value in thunderclient url
    const { sort, field } = req.query;
    const { authorization } = req.headers; //we destructing our authorization from headers where our auth token is stored
    //console.log(req.)
    //check the user have authenticate token or not
    jwt.verify(authorization.split(" ")[1], jwtSecret, (err, data) => { //here we used "split" function because in authentication token
        //we have bearer and token,so we make array withthe help of split() function and take index 1 for token
        if (err) {
            res.json({ success: false, error: err, message: "not authorized" })
        } else {
            // const { user_type } = data;
            // global.userType = user_type;
            //res.json({data}) we can send one response.jdon otherwise it gives error.
            user.find({})
                .sort({ [field]: sort === 'asc' ? 1 : -1 })
                .then(resp => {

                    res.status(200).json({ success: true, message: "succesfully received", data: resp, loginuser: data })
                })
                .catch(err => { res.status(200).json({ success: false, message: err.message }) })

        }
    })








    // toArray(function (err, data) {
    //     if (err) {
    //         res.status(200).json({ success: false, message:err })
    //     } else {

    //         res.status(200).json({ success: true, message: "succesfully received", data:data })

    //     }
    // });
})
route.post('/deleteusers', async (req, res) => {
    const { authorization } = req.headers; //we destructing our authorization from headers where our auth token is stored

    //check the user have authenticate token or not
    jwt.verify(authorization.split(" ")[1], jwtSecret, (err, data) => {
        //we have bearer and token,so we make array withthe help of split() function and take index 1 for token
        if (err) {
            res.json({ success: false, error: err, message: "not authorized" })
        } else {
            const { user_type, _id } = data;
            // global.userType = user_type;
            if (user_type === "admin") {
                const { id } = req.body;

                if (id !== _id) {
                    //here we used "split" function because in authentication token
                    user.findByIdAndDelete(id)
                        .then(resp => {
                            res.status(200).json({ success: true, message: "data succesfully deleted", data: resp })
                        })
                        .catch(cat => { res.status(200).json({ success: false, message: "error occured", err: cat.message }) })
                } else {
                    res.status(200).json({ success: false, message: "you can't delete yourself" })
                }

            } else {
                res.json({ success: false, message: "non admin users can't delete data" });
            }
            //res.json({data}) we can send one response.jdon otherwise it gives error.

        }
    })


})
module.exports = route;