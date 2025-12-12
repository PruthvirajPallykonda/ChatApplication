import client from "./client";

export const getAllChatRooms = () => {
    client.get("/api/chat/getall/chatrooms");
}

export const getMessagesByRoomApi = (roomId) => {
    client.get(`/api/chat/get/messages/usingroomid/${roomId}`);
}

export const sendMessageApi = (payload) => {
    client.get('/api/chat/sendmessage', payload);
}