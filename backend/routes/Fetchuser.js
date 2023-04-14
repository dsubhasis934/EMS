const express = require('express');
const mongoose = require('mongoose');
const route = express.Router();
const user = require('../modules/Userschema');
route.get('/fetchuser', (req, res) => {
    const { id } = req.query;
    user.find({ _id: id })
        .then(resp => {
            res.status(200).json({ success: true, message: "successfully fetched", data: resp })
        })
        .catch(error => {
            res.status(200).json({ success: false, message: "data not fetched", error: error.message })
        })
})
module.exports = route;