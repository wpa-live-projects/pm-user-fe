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

  // Load from localStorage
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

  // Sync latest user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${userId}`);
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

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/projects/user/${userId}`);
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
    navigate('/');
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users/change-password', {
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome {user?.name || 'Loading...'}
        </h1>
        <div className="space-x-3">
          <button
            onClick={() => setShowChangePassword(!showChangePassword)}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            {showChangePassword ? 'Close' : 'Change Password'}
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Password Change Form */}
      {showChangePassword && (
        <form onSubmit={handlePasswordChange} className="bg-white shadow p-4 rounded mb-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Change Password</h3>
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

      <h2 className="text-xl font-semibold mb-4 text-indigo-700">Your Projects</h2>
      {projects.length === 0 ? (
        <p className="text-gray-500">No projects assigned to you yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onClick={() => navigate(`/project/${project._id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
