import client from "./client";

export const getAllUsersApi = () => {
    client.get("/api/users/getallusers");
}

export const searchUsersApi = (query) => {
    client.get("/api/users/search", {
        params: {query},
    });
}