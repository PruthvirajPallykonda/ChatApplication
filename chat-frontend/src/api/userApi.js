import client from "./client";

export const getAllUsersApi = () => {
    client.get("/users/getallusers");
}

export const searchUsersApi = (query) => {
    client.get("/users/search", {
        params: {query},
    });
}