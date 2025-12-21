// src/api/chatContacts.js
import client from "./client";

export async function fetchContacts() {
  const res = await client.get("/api/chat/contacts");
  return res.data || [];
}
