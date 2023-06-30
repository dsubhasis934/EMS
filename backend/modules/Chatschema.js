const mongoose = require('mongoose');
const { Schema } = mongoose;

const chatSchema = new Schema({
    room: {
        type: String,
        Required: true
    },
    author: {
        type: String,
        Required: true
    },
    message: {
        type: String,
        Required: true
    },
    authorId: {
        type: String,
        Required: true
    },
    id: {
        type: String,
        Required: true
    },
    receiver: {
        type: String,
        Required: true
    },
    receiverId: {
        type: String,
        Required: true
    },
    image: {
        type: String
    },
    authorImage: {
        type: String
    },
    time: {
        type: String,
        Required: true
    },
    lastMessage: {
        type: String,
        Required: true
    }
});
module.exports = mongoose.model('chats', chatSchema);