import { useState } from "react";
import UserCard from "../../components/users/UserCard";
import client from "../../api/client";

function UserSearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await client.get("/users/search", {
        params: { query: searchTerm },
      });
      setUsers(response.data);
    } catch (err) {
      setError("Failed to search users.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 text-slate-100 flex flex-col items-center pt-12 sm:pt-16 px-3 sm:px-0 overflow-x-hidden">
      <h1 className="text-2xl font-semibold mb-6">Search Users</h1>

      <form
        onSubmit={handleSearch}
        className="w-full max-w-xl flex gap-3 mb-4 px-4"
      >
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by phone number or username"
          className="w-full flex-1 rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="px-3 sm:px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-sm font-medium whitespace-nowrap"
          >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && (
        <div className="w-full max-w-xl mb-4 px-4">
          <div className="rounded-lg bg-red-500/10 border border-red-500 text-sm px-3 py-2">
            {error}
          </div>
        </div>
      )}

      <div className="w-full max-w-xl px-4 space-y-3">
        {users.length === 0 && !loading && !error && (
          <p className="text-sm text-slate-400">No users found.</p>
        )}

        {users.map((user) => (
          <UserCard key={user.userId} user={user} />
        ))}
      </div>
    </div>
  );
}

export default UserSearchPage;
