const mongoose = require('mongoose');
const { Schema } = mongoose;
const conversationSchema = new mongoose.Schema({
    client1: String,
    client2: String,
    room: String
});
module.exports = mongoose.model('Conversation', conversationSchema);