const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const mongoose = require('mongoose');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');
const Message = require('./models/Message')

const chat = (server) => {
    const io = socketio(server, { 'multiplex': false });
    const botName = 'SPS Bot';

    io.on('connection', socket => {
        socket.on('joinRoom', async ({ username, room }) => {
            const user = userJoin(socket.id, username, room);
            const messages = await Message.find({ room: user.room })

            socket.emit('message', formatMessage(botName, 'Welcome to SPS!', messages.length != 0 ? messages[0].date : undefined));

            if (messages) {
                messages.forEach(msg => {
                    io.emit('message', formatMessage(msg.username, msg.text, msg.date))
                })
            }

            socket.join(user.room);

            socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));

            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        })

        socket.on('chatMessage', async msg => {
            const user = getCurrentUser(socket.id);
            const message = new Message({
                room: user.room,
                username: user.username,
                text: msg
            })

            io.to(user.room).emit('message', formatMessage(user.username, msg));

            await message.save()
        })

        socket.on('clear', async () => {
            const user = getCurrentUser(socket.id)

            await Message.deleteMany({ room: user.room })
            socket.emit('cleared')
        })

        socket.on('disconnect', () => {
            const user = userLeave(socket.id);

            if (user) {
                io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));
            }

            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        })
    })
}

module.exports = chat