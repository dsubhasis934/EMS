const express = require('express');
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
route.patch("/updateusers", upload.single('image'), (req, res) => {
    const { id } = req.query;
    console.log(id);
    user.findById(id)
        .then(resp => {
            console.log(req);
            //  res.status(200).json({ success: true, message: "id find successfully", data: resp }) 
            const { name, user_type, secure_phase } = req.body;
            const { filename } = req.file;
            console.log(name, user_type, secure_phase, filename);
            user.findByIdAndUpdate(id, {
                name: name,
                user_type: user_type,
                secure_phase: secure_phase,
                image: filename
            }, { new: true })
                .then(response => {
                    console.log(response)
                    res.status(200).json({ success: true, message: "id updated successfully", data: response })
                })
                .catch(error => { res.status(200).json({ success: false, message: "error occured", err: error.message }) })
        })
        .catch(err => { res.status(200).json({ success: false, message: "id not found", err: err.message }) })
})
module.exports = route;