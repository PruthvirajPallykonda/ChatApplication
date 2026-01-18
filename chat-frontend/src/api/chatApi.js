import client from "./client";

export const getAllChatRooms = () => {
    client.get("/chat/getall/chatrooms");
}

export const getMessagesByRoomApi = (roomId) => {
    client.get(`/chat/get/messages/usingroomid/${roomId}`);
}

export const sendMessageApi = (payload) => {
    client.get('/chat/sendmessage', payload);
}