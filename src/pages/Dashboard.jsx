import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProjectCard from '../Components/ProjectCard';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (!userId) {
      toast.error('Unauthorized. Please login.');
      navigate('/');
    }

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [userId, navigate]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`https://pm-user-be.onrender.com/api/users/${userId}`);
        setUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
      } catch (err) {
        toast.error('Failed to fetch user data. Redirecting...');
        localStorage.clear();
        navigate('/');
      }
    };
    if (userId) fetchUser();
  }, [userId, navigate]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`https://pm-user-be.onrender.com/api/projects/user/${userId}`);
        setProjects(res.data);
      } catch (err) {
        toast.error('Failed to load projects');
      }
    };
    if (userId) fetchProjects();
  }, [userId]);

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Logged out');
    alert('Logged out');
    navigate('/');
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://pm-user-be.onrender.com/api/users/change-password', {
        userId,
        oldPassword,
        newPassword,
      });
      alert('Password changed successfully');
      setShowChangePassword(false);
      setOldPassword('');
      setNewPassword('');
    } catch (error) {
      alert(error.response?.data?.error || 'Password change failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-blue-600 m-0 p-0">
      {/* Top bar */}
      <div className="flex justify-end mb-6 space-x-3">
        <button
          onClick={() => setShowChangePassword(!showChangePassword)}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          {showChangePassword ? 'Close' : 'Change Password'}
        </button>
        <button
          onClick={handleLogout}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          Logout
        </button>
      </div>

      {/* Welcome Card */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-10 text-center mb-12">
        <p className="text-orange-600 text-6xl font-semibold mb-2">Welcome</p>
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
          {user?.name || 'Loading...'}
        </h1>
      </div>

      {/* Password Change Form */}
      {showChangePassword && (
        <form
          onSubmit={handlePasswordChange}
          className="bg-white shadow-md p-6 rounded-lg max-w-md mx-auto mb-10"
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Change Password</h3>
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full mb-3 p-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full mb-3 p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Update Password
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 max-w-5xl mx-auto">
        {projects.map((project, index) => (
          <div
            key={project._id}
            onClick={() => window.open(`/project/${project._id}`, '_blank')}
            className="cursor-pointer bg-white border border-orange-400 rounded-2xl shadow-lg p-8 h-56 flex flex-col justify-between transition-transform hover:scale-105 hover:shadow-2xl"
          >
            <div>
              <h3 className="text-2xl font-bold text-orange-600 capitalize mb-2">{project.title}</h3>
              <p className="text-gray-700 text-base mb-4">{project.description?.substring(0, 70) || 'No description'}</p>
              <p className="text-sm text-gray-500">
                <span className="font-semibold">Deadline:</span> {project.deadline?.split('T')[0] || 'N/A'}
              </p>
              <div className="flex justify-center">
                <button
                  type="button"
                  className="bg-orange-500 text-white px-4 py-2 rounded shadow hover:bg-orange-600 transition"
                  tabIndex={-1}

                >
                  View More
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
