"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let usersOnline = [];
function default_1(socket, io) {
    socket.on('join', (userId) => {
        socket.join(userId);
        if (usersOnline.findIndex(user => user.user_id === userId) === -1) {
            usersOnline.push({
                user_id: userId,
                socket_id: socket.id
            });
        }
        io.emit('user-online', usersOnline);
        io.emit("setup socket", socket.id);
    });
    socket.on('disconnect', () => {
        usersOnline = usersOnline.filter(user => user.socket_id !== socket.id);
        io.emit('user-online', usersOnline);
    });
    socket.on('join conversation', (conversationId) => {
        socket.join(conversationId);
    });
    socket.on("send message", (message) => {
        let conversation = message.conversation;
        if (!conversation.users)
            return;
        conversation.users.forEach((user) => {
            if (user._id === message.sender._id)
                return;
            socket.in(user._id).emit("receive message", message);
        });
    });
    socket.on("typing", (conversation) => {
        socket.in(conversation).emit("typing", conversation);
    });
    socket.on("stop typing", (conversation) => {
        socket.in(conversation).emit("stop typing");
    });
    socket.on("call user", ({ userToCall, signal, name, from, avatar }) => {
        const userId = userToCall;
        const userSocket = usersOnline.find(user => user.user_id === userId);
        io.to(userSocket.socket_id).emit("call user", { signal, name, from, avatar });
    });
    socket.on("answer call", (data) => {
        io.to(data.to).emit("call accepted", data.signal);
    });
    socket.on("end call", (id) => {
        io.to(id).emit("end call");
    });
}
exports.default = default_1;
