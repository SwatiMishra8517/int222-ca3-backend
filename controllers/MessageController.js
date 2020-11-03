const Message = require("../models/message");

class MessageController {}

MessageController.getAllMessages = () => {
    return Message.find();
};

MessageController.store = (message, from) => {
    console.log("Storing message on behalf of", from);
    const newRecord = new Message({
        text: message,
        from,
    });
    return newRecord.save();
};

module.exports = MessageController;
