const MessageController = require("../controllers/MessageController");
const UserController = require("../controllers/UserController");

class SocketHandler {
    constructor(io) {
        this.io = io;
        this.init();
        this.users = {};
        this.activeUsers = [];
    }
    init() {
        this.io.on("connection", (socket) => {
            socket.on("join", this.onJoin.bind(this, socket));
            socket.on("message", this.onMessage.bind(this, socket));
            socket.on("disconnect", this.onLeave.bind(this, socket));
            socket.on("typeStart", this.onTypeStart.bind(this, socket));
            socket.on("typeEnd", this.onTypeEnd.bind(this, socket));
        });
    }
    async onJoin(socket, data) {
        this.users[data._id] = socket.id;

        const exists = this.activeUsers.find((u) => u._id == data._id);
        if (!exists) {
            this.activeUsers.push(data);
        }
        let allusers = await UserController.getUsers();
        allusers = allusers.map((user) => ({
            ...user._doc,
            online: !!this.activeUsers.find((u) => u._id == user._id),
        }));
        // send the list of all users to the freshly joined user
        this.io.to(socket.id).emit(
            "allUsers",
            allusers.filter((u) => u._id.toString() !== data._id)
        );
        // give alert to everybody about new user
        socket.broadcast.emit("newUser", data._id);
        // send all the group messages
        this.io
            .to(socket.id)
            .emit("groupChats", await MessageController.getAllMessages());
    }
    getUserBySocketId(socketId) {
        const user = [...Object.entries(this.users)].find(
            (user) => user[1] == socketId
        );
        if (user) return this.activeUsers.find((u) => u._id == user[0]);
        else return null;
    }
    onMessage(socket, data) {
        if (data.to == "groupChat") {
            const user = this.getUserBySocketId(socket.id);
            socket.broadcast.emit("receiveMessage", {
                ...data,
                text: data.text,
                sender: user.username,
            });
            if (data.typing == undefined) {
                MessageController.store(data.text, user.username);
            }
        } else {
            socket.to(this.users[data.to]).emit("receiveMessage", {
                ...data,
                text: data.text,
                from: this.getUserBySocketId(socket.id)._id,
            });
        }
    }
    onLeave(socket) {
        console.log(socket.id, "left");
        const userLeft = [...Object.entries(this.users)].find(
            (user) => user[1] == socket.id
        );
        if (!userLeft) return;
        this.activeUsers = this.activeUsers.filter(
            (user) => user._id !== userLeft[0]
        );
        socket.broadcast.emit("userLeft", userLeft[0]);
        this.users[userLeft[0]] = undefined;
    }
    onTypeStart(socket, data) {
        console.log(data, "started typing");
        this.onMessage(socket, { ...data, typing: true });
    }
    onTypeEnd(socket, data) {
        console.log(data, "ended typing");
        this.onMessage(socket, { ...data, typing: false });
    }
}

module.exports = SocketHandler;
