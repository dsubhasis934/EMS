const express = require('express');
const route = express.Router();
const Receiver = require('../modules/Chatschema');
const Users = require('../modules/Userschema');
// const pipeline = [
//     // Group by receiver field and get the max timestamp for each group
//     { $group: { _id: "$receiver", lastMessageTime: { $max: "$timestamp" } } },
//     // Lookup the message collection to get the full message data for each receiver and their last message
//     {
//         $lookup: {
//             from: "message",
//             let: { receiverName: "$_id", lastMessageTime: "$lastMessageTime" },
//             pipeline: [
//                 { $match: { $expr: { $and: [{ $eq: ["$receiver", "$$receiverName"] }, { $eq: ["$timestamp", "$$lastMessageTime"] }] } } },
//                 { $project: { _id: 0, message: 1 } }
//             ],
//             as: "lastMessage"
//         }
//     },
//     // Project the desired output fields
//     {
//         $project: {
//             _id: 0,
//             receiver: "$_id",
//             lastMessage: { $arrayElemAt: ["$lastMessage", 0] }
//         }
//     }
// ];
route.get('/fetchreceiver', (req, res) => {
    Receiver.distinct('receiver', {}, (err, receiverNames) => {
        if (err) {
            res.status(200).json({ status: false, message: "receivers not found", err: err.message })
            return;
        }
        Receiver.aggregate([{ $sort: { time: -1 } },
        {
            $group: {
                _id: '$receiver',
                message: { $first: '$$ROOT' },
            },
        },
        ])
            .then(responses => {
                return res.status(200).json({ status: true, message: "receivers found from users successfully", data: responses })
            })
            .catch(cat => { res.status(200).json({ status: false, message: "receivers not found", err: err }) })
        //return res.status(200).json({ status: true, message: "receivers found successfully", data: receiverNames })


    });
    // Execute the aggregation pipeline
    // Receiver.aggregate(pipeline, (err, result) => {
    //     if (err) {
    //         res.status(500).json({ status: false, message: "error fetching unique receivers and their last messages", error: err.message });
    //     } else {
    //         res.status(200).json({ status: true, message: "unique receivers and their last messages fetched successfully", data: result });
    //     }
    // });

    // Receiver.find().select('receiver message')
    //     .then(resp => {
    //         res.status(200).json({ status: true, message: "receivers found successfully", data: resp })
    //     })
    //     .catch(err => {
    //         res.status(200).json({ status: false, message: "receivers not found", err: err.message })
    //     })
})
module.exports = route