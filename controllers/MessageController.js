const Message = require("../models/message");

class MessageController {}

MessageController.getAllMessages = () => {
    return Message.find();
};

MessageController.store = (message, from) => {
    const newRecord = new Message({
        text: message,
        from,
    });
    return newRecord.save();
};

module.exports = MessageController;
