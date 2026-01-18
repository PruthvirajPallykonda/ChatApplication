import axios from 'axios'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import client from "../../api/client";

function RegisterPage() {
  
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const response = await client.post("/auth/register", {
        phoneNumber,
        password,
        username
      });
      const user = response.data;
      setSuccess('Registration successful! You can now log in.');
      setPhoneNumber('');
      setPassword('');
      setUsername('');
      // Optionally navigate to login page after registration
      setTimeout(() => {
        navigate('/login');
      },800);
    } catch (err) {
      setError('Registration failed. Please try again.');
      }
      finally {
        setLoading(false);
      }
    }
  return (
    <div className='min-h-screen w-screen flex items-center justify-center bg-slate-900 text-slate-100'>
      <div className='w-full max-w-md bg-slate-800 rounded-xl shadow-lg p-8'>
        <h1 className="text-2xl font-semibold mb-6 text-center">Register</h1>
        {
          error && (
            <div className='mb-4 rounded-lg bg-red-500/10 border border-red-500 text-sm px-3 py-2'>{error}</div>
          )
        }

        {
          success && (
            <div className='mb-4 rounded-lg bg-emerald-500/10 border border-emerald-500 text-sm px-3 py-2'>{success}</div>
          )
        }
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm mb-1'>Phone number</label>
            <input type='text' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className='w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500' placeholder='Enter phone number' required/>
          </div>
          <div>
            <label className='block text-sm mb-1'>UserName</label>
            <input type='text' value={username} onChange={(e)=>setUsername(e.target.value)}
            className='w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500' placeholder='Enter username' required/>
          </div>
          <div>
            <label className='block text-sm mb-1'>Password</label>
            <input type='password' value={password} onChange={(e)=>setPassword(e.target.value)}
            className='w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500' placeholder='Enter password' required/>
          </div>
          <button type='submit' disabled={loading} className='w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors px-4 py-2 text-sm font-medium'>{loading ? 'Creating account...' : 'Register'}</button>
          <div className="mt-4 text-center text-sm text-slate-300"> <span>Already Registered ? </span> <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium"> Sign In </Link> </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage
