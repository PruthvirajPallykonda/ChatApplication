// src/api/chatContacts.js
import client from "./client";

export async function fetchContacts() {
  const res = await client.get("/chat/contacts");
  return res.data || [];
}
