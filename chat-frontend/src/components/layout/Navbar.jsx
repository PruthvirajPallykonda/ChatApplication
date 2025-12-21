import React from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext';

function Navbar() {
    const navigate = useNavigate();
    const {user, logout} = useAuth();
    
    const handleLogout = () => {
        logout();
        navigate('/login',{replace:true})
    };
    
  return (
    <nav className=" w-screen bg-slate-900 border-b border-slate-800 h-14 flex items-center px-4 justify-between">
    <div className="flex items-center gap-3">
    <span className="text-indigo-400 font-semibold">Chat App</span>
        <div className="hidden sm:flex gap-3 text-sm text-slate-300">
        <Link to="/chat" className="hover:text-white">
        Rooms
        </Link>
        <Link to="/users" className="hover:text-white">
        Users
        </Link>
        <Link to="/users/search" className="hover:text-white">
        Search
        </Link>
        <Link
        to="/contacts"
        className="text-sm text-slate-300 hover:text-white mr-4">
        Contacts
        </Link>
    </div>
    </div>
    <div className="flex items-center gap-3 text-sm">
        {user && (
        <span className="text-slate-300 hidden sm:inline">
            {user.username} ({user.phoneNumber})
        </span>
    )}
    <button
      onClick={handleLogout}
      className="rounded-lg bg-red-600 hover:bg-red-500 px-3 py-1 text-xs font-medium text-white"
    >
      Logout
    </button>
  </div>
</nav>
  )
}

export default Navbar
