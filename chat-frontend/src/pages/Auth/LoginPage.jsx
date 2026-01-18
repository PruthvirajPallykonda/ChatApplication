import axios from "axios"
import { useState } from "react"
import { Link,  useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext";
import client from "../../api/client";
import {Eye, EyeOff} from "lucide-react";

 

function LoginPage() {

    const navigate = useNavigate();
    const {login} =  useAuth();

    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await client.post("/auth/login", {
                phoneNumber,
                password
            });
            const user = response.data;
            login(user);
            navigate("/chat");
        }
        catch (err) {
            setError(err.response?.data?.message || "Login failed. Please try again.");
        } finally {
        setLoading(false);
        }
    };

    const togglePassword = () => {
        setShowPassword(prev => !prev);
    }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex items-center justify-center bg-slate-900 text-slate-100">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg bg-slate-800 rounded-xl shadow-lg p-5 sm:p-7 lg:p-8">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-5 lg:mb-6 text-center">Login</h2>
                {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500 text-sm px-3 py-2">
            {error}
        </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label className="block text-sm mb-1">Phone number</label>
            <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-3 sm:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter phone number"
            required
            />
        </div>

        <div>
        <label className="block text-sm mb-1">Password</label>
        <div className="relative">
            <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-3 sm:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter password"
            required
            />

            <button
                type="button"
                onClick={togglePassword}
                className="absolute inset-y-0 right-3 flex items-center p-1 text-slate-400 hover:text-slate-200"
                aria-label="Toggle password visibility">
                {showPassword ? (
                <EyeOff className="w-5 h-5" />
                ) : (
                <Eye className="w-5 h-5" />
                )}
            </button>

        </div>
        </div>
        <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors px-4 py-2 text-sm font-medium"
        >
            {loading ? "Logging in..." : "Login"}
        </button>
        <div className="mt-4 text-center text-xs sm:text-sm text-slate-300"> <span>Don&apos;t have an account? </span> <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium"> Sign up </Link> </div>
        </form>
    </div>
</div>
  )
}

export default LoginPage
