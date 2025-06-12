import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/logo.jpg';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://pm-user-be.onrender.com/api/users/signup', {
        name,
        email,
        password,
      });

      alert('Signup successful');
      navigate('/');
    } catch (error) {
      const message =
        error.response?.data?.error || 'Signup failed. Please try again.';
      alert(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-400 ">
      <div className="flex flex-col md:flex-row items-center md:items-stretch w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden">

        {/* Logo Side */}
        <div className="md:w-1/2 w-full bg-white flex items-center justify-center p-4">
          <img
            src={logo}
            alt="Logo"
            className="w-full h-full object-contain max-h-[450px] p-4"
          />
        </div>

        {/* Signup Form Side */}
        <div className="md:w-1/2 w-full p-8 flex items-center justify-center">
          <div className="w-full max-w-md space-y-6">
            <h2 className="text-3xl font-bold text-center text-black">User Signup</h2>

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">Name:</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Email:</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Password:</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition duration-300 shadow"
              >
                Signup
              </button>
            </form>

            <p className="text-sm text-center text-gray-700">
              Already have an account?{' '}
              <span
                className="text-blue-600 font-semibold hover:underline cursor-pointer"
                onClick={() => navigate('/')}
              >
                Login
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
