import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import client from "../../api/client";

function ChatRoomsPage() {

    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRooms = async () => {
            setError(null);
            setLoading(true);
            try {
                const response = await client.get('/api/chat/getall/chatrooms');
                setRooms(response.data || [] );
            }
            catch (err) {
                setError(err.message || 'Something went wrong');
            }
            finally {
                setLoading(false);
        }
    };
        fetchRooms();
}, []);

    const handleOpenRoom = (roomId) => {
        navigate(`/chat/${roomId}`);
    }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex">
        <aside className='max-w-md mx-auto md:w-80 md:mx-0 bg-slate-800 border-r border-slate-700 p-4'>
        <h1 className="text-xl font-semibold mb-4">Chat Rooms</h1>
        {
            loading && (
                <p className='text-sm text-slate-400'>Loading rooms...</p>
            )
        }
        {
            error && (
            <div className="mb-3 rounded-lg bg-red-500/10 border border-red-500 text-sm px-3 py-2">{error}</div>
            )
        }
        {
            !loading && !error && rooms.length === 0 && (
                <p className='text-sm text-slate-400'>No chat rooms found.</p>
            )
        }
        <ul className='space-y-2 mt-2'>
        {
            rooms.map((room) => (
                <li key={room.id} onClick={()=>handleOpenRoom(room.id)} className="rounded-lg bg-slate-700 hover:bg-slate-600 cursor-pointer px-3 py-2 text-sm flex items-center justify-between">
                    <div className='font-medium'>Room #{room.id}</div>
                    <div className='text-xs text-slate-300'>user1Id: {room.user1Id} - user2Id: {room.user2Id}</div>
                    <span className='text-xs text-indigo-300'>Open</span>
                </li>
            ))}
        </ul>
        </aside>
        <main className='hidden md:flex flex-1 items-center justify-center'>
            <p className='text-slate-400 text-sm'>Select a room on the left to open the chat</p>
        </main>
    </div>
  )
}

export default ChatRoomsPage
