import './App.css'
import {Routes, Route, Navigate} from 'react-router-dom'
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import ChatRoomsPage from "./pages/Chat/ChatRoomsPage";
import ChatRoomPage from "./pages/Chat/ChatRoomPage";
import UsersListPage from "./pages/Users/UsersListPage";
import UserSearchPage from "./pages/Users/UserSearchPage";
import ProtectedRoute from './components/layout/ProtectedRoute';
import Navbar from './components/layout/Navbar';

function App() {

  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />

      <Route path="/chat" element={<ProtectedRoute><div className="h-screen w-screen overflow-hidden bg-slate-900 text-slate-100 flex flex-col"><Navbar /><ChatRoomsPage /></div></ProtectedRoute>} />
      
      <Route path="/chat/:roomId" element={<ProtectedRoute><div className="h-screen w-screen overflow-hidden bg-slate-900 text-slate-100 flex flex-col"><Navbar /><ChatRoomPage /></div></ProtectedRoute>} />

      <Route path="/users" element={<ProtectedRoute><div className="h-screen w-screen overflow-hidden bg-slate-900 text-slate-100 flex flex-col"><Navbar /><UsersListPage /></div></ProtectedRoute>} />
      
      <Route path="/users/search" element={<ProtectedRoute><div className="h-screen w-screen overflow-hidden bg-slate-900 text-slate-100 flex flex-col"><Navbar /><UserSearchPage /></div></ProtectedRoute>} />

      {/* <Route path="/chat" element={<ChatRoomsPage />} />

      <Route path="/chat/:roomId" element={<ChatRoomPage />} />

      <Route path="/users" element={<UsersListPage />} />

      <Route path="/users/search" element={<UserSearchPage />} /> */}

      <Route path="/" element={<Navigate to="/chat" replace />} />
      <Route path="*" element={<Navigate to="/chat" replace />} />
    </Routes>
  )
}

export default App
