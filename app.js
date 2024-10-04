import { Server } from "socket.io";
import 'dotenv/config'

const io = new Server({
    cors: {
        origin: process.env.SOCKET_BASE_URL
    }
})

let onlineUser = []
console.log("The current url", process.env.SOCKET_BASE_URL);
const addUser = (userId, socketId) => {
    const userExists = onlineUser.find((user) => user.userId === userId)
    if (!userExists) {
        onlineUser.push({ userId, socketId })
    }
}

const getUser = (userId) => {
    console.log("Get user with user Id: ", userId);
    return onlineUser.find((user) => user.userId === userId)
}

const removeUser = (socketId) => {
    onlineUser = onlineUser.filter((user) => user.socketId !== socketId)
}

io.on("connection", (socket) => {
    socket.on("newUser", (userId) => {
        addUser(userId, socket.id)
        console.log("Online Users are:", onlineUser);
    })

    socket.on("sendMessage", ({ reciverId, data, username }) => {
        const reciver = getUser(reciverId)
        const res = { ...reciver }
        io.to(res.socketId).emit("getMessage", data);
    })

    socket.on("disconnect", () => {
        removeUser(socket.id)
    })
})

io.listen("4000")