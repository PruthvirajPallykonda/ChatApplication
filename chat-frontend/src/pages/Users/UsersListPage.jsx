import React, { useEffect, useState } from "react";
import axios from "axios";
import UserCard from "../../components/users/UserCard";
import client from "../../api/client";

function UsersListPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setError("");
      setLoading(true);
      try {
        const res = await client.get("/users/getallusers");
        setUsers(res.data || []);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      <h1 className="text-2xl font-semibold mb-4">All Users</h1>

      {loading && <p className="text-sm text-slate-400 mb-4">Loading users...</p>}

      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500 text-sm px-3 py-2">
          {error}
        </div>
      )}

      {!loading && !error && users.length === 0 && (
        <p className="text-sm text-slate-400">No users found.</p>
      )}

      {!loading && users.length > 0 && (
        <div className="mt-4">
          {users.map((u) => (
            <div key={u.userId} className="mb-3">
              <UserCard user={u} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UsersListPage;
