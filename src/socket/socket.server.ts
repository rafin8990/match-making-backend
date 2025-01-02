import { io } from "../server";

export function socket_server() {
    io.on("connection", (socket: any) => {
        console.log('socket connected successfully', socket.id);

        socket.on("disconnect", () => {
            console.log("disconnect to socket ", socket.id)
        })
    })
}