import client from "./client";

export const loginApi = (data) => {
    client.post("/api/auth/register", data);
}