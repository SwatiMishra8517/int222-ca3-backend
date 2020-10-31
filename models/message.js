const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    from: String,
    time: {
        type: Date,
        default: Date.now(),
    },
    text: String,
});

const Message = mongoose.model("message", MessageSchema);

module.exports = Message;
