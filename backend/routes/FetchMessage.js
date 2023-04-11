const express = require('express');
const mongoose = require('mongoose');
const route = express.Router();
const chat = require('../modules/Chatschema');
route.get('/fetchchat', (req, res) => {
    const { room, receiver, receiverId } = req.query;

    console.log(room, receiver, receiverId);
    //const justId = id.split('&&');
    chat.find({ room })
        .then(resp => {
            res.status(200).json({ success: true, message: "successfully fetched", data: resp })
        })
        .catch(error => {
            res.status(200).json({ success: false, message: "failed to fetch", error: error.message })
        })
})
module.exports = route;