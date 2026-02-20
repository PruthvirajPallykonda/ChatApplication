import client from "./client";

export const loginApi = (data) => {
    client.post("/auth/register", data);
}