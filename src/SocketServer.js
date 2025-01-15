let onlineUsers = []

const SocketServer = (socket, io) => {
    // User Joins or Active Users or Opens the application
    socket.on('join', (user) => {
        socket.join(user)
        // add joined user to online user
        if (!onlineUsers.some((u) => u.userId === user)) {
            // console.log(`user ${user} now online`);
            onlineUsers.push({ userId: user, socketId: socket.id })
        }
        // send online users
        io.emit('get online users', onlineUsers)

        // send socket id for calling
        io.emit('setup socket', socket.id)
    })

    // io use for always get this online user info
    // socket / offline/  is offline
    socket.on('disconnect', () => {
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id)
        // console.log('user diconnect now');
        io.emit('get online users', onlineUsers)
    })

    // join a conversation room
    socket.on('join conversation', (conversation) => {
        // console.log(conversation);
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

    //?--------calling system here----------
    socket.on('call user', (data) => {
        let userId = data.userToCall;
        // online users have socketId and userId
        let userSocketIdToCall = onlineUsers.find((user) => user.userId == userId)
        io.to(userSocketIdToCall.socketId).emit('call user', {
            // the user whom are you call
            signal: data.signal,
            // who are calling or initially me
            from: data.from,
            name: data.name,
            image: data.image,
            // socket id for whom we want to call
        })
    })

    //?--------answer call system here----------
    socket.on('answer call', (data) => {
        io.to(data.to).emit("call accepted", data.signal)
    })


    //?------------end call-------------
    socket.on('end call', (id) => {
        io.to(id).emit("call ended")
    })


    // for ice candidates
    socket.on("candidate", (data) => {
        console.log(data, "data here");
    })
};

module.exports = SocketServer;