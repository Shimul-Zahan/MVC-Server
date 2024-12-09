let onlineUsers = []

const SocketServer = (socket, io) => {
    // User Joins or Active Users or Opens the application
    socket.on('join', (user) => {
        socket.join(user)
        // add joined user to online user
        if (!onlineUsers.some((u) => u.userId === user)) {
            console.log(`user ${user} now online`);
            onlineUsers.push({ userId: user, socketId: socket.id })
        }
        // send online users
        io.emit('get online users', onlineUsers)
    })
    // io use for always get this online user info
    // socket / offline/  is offline
    socket.on('disconnect', () => {
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id)
        console.log('user diconnect now');
        io.emit('get online users', onlineUsers)
    })

    // join a conversation room
    socket.on('join conversation', (conversation) => {
        console.log(conversation);
        socket.join(conversation)
    })

    // send and received message
    socket.on('send message', (message) => {
        console.log(message, "with files here");
        let conversation = message.conversation;
        console.log(conversation);
        if (!conversation.users) return;
        conversation.users.forEach(user => {
            if (user._id === message.sender._id) return;
            socket.in(user._id).emit('receive message', message)
        });
    })

    // typing
    socket.on('typing', (conversation) => {
        console.log('typing', conversation);
        socket.in(conversation).emit("typing", conversation)
    })
    // stop typing
    socket.on('stop typing', (conversation) => {
        // console.log('stop typing', conversation);
        socket.in(conversation).emit("stop typing", conversation)
    })
};

module.exports = SocketServer;