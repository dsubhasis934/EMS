const express = require("express");
const router = express.Router();
const Receiver = require("../modules/Chatschema");

// Update receiver's last message
router.post("/lastMessage", async (req, res) => {
    const { receiverId, message } = req.body;

    Receiver.findOneAndUpdate(
        { receiverId },
        { $set: { message: message } },
        { new: true },

    )
        .then(resp => {

            res.status(200).json({ success: true, message: "data updated successfully", data: resp })
        })
        .catch(cat => res.status(200).json({ success: false, message: "data not updated", err: cat.message }))

    // try {
    //     const receiver = await Receiver.find({ receiverId });
    //     console.log(receiver);
    //     if (!receiver) {
    //         return res.status(404).json({
    //             status: false,
    //             message: "Receiver not found",
    //         });
    //     }

    //     receiver.message = lastMessage;
    //     await receiver.save();

    //     return res.status(200).json({
    //         status: true,
    //         message: "Receiver's last message updated successfully",
    //     });
    // } catch (error) {
    //     console.error(error.message);
    //     return res.status(500).json({
    //         status: false,
    //         message: "Server error",
    //     });
    // }
});

module.exports = router;





