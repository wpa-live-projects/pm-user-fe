import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import TaskCard from '../Components/TaskCard';


export default function ProjectPage() {
  const { id } = useParams();
  const userId = localStorage.getItem('userId');
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [project, setProject] = useState(null);
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState('');
  const [isCommenting, setIsCommenting] = useState({});

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`https://pm-user-be.onrender.com/api/projects/user/${userId}`);
      const data = res.data;
      const matchedProject = data.find(p => p._id === id);
      if (matchedProject) {
        setProject(matchedProject);
        setTasks(matchedProject.tasks);
        // Fetch all comments for the tasks
        matchedProject.tasks.forEach(task => {
          fetchComments(task._id);
        });
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      alert('Failed to load tasks. Please try again.');
    }
  };

  const fetchComments = async (taskId) => {
    try {
      const res = await axios.get(`https://pm-user-be.onrender.com/api/tasks/${taskId}/comments`);
      setComments((prev) => ({ ...prev, [taskId]: res.data }));
    } catch (error) {
      console.error('Error fetching comments:', error);
      alert('Failed to load comments. Please try again.');
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      const res = await axios.put(`https://pm-user-be.onrender.com/api/tasks/${taskId}/status`, {
        status: newStatus
      });
      const updatedTask = res.data;
      setTasks((prev) =>
        prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
      );
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update task status. Please try again.');
    }
  };

  const handleAddComment = async (taskId) => {
    if (!commentText.trim()) return;

    try {
      await axios.post(`https://pm-user-be.onrender.com/api/tasks/${taskId}/comment`, {
        text: commentText
      });

      // Show success alert
      alert('Comment added successfully!');

      // Reset comment input and toggle commenting state
      setCommentText('');
      setIsCommenting((prev) => ({ ...prev, [taskId]: false }));
      fetchComments(taskId); // Refresh only that task's comments
    } catch (error) {
      console.error('Failed to add comment:', error);
      alert('Failed to add comment. Please try again.');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [id]);

  const filteredTasks = tasks
    .filter(task => task.title.toLowerCase().includes(search.toLowerCase()))
    .filter(task => (statusFilter === 'All' ? true : task.status === statusFilter));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 to-blue-500 p-8">
      {project && (
        <div className="mb-8 bg-white/90 border-l-8 border-orange-300 p-8 rounded-2xl shadow-2xl backdrop-blur-sm">
          <h1 className="text-4xl font-bold text-black-400 mb-2">{project.title}</h1>
          <p className="text-gray-800 mb-2">{project.description}</p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Deadline:</span> {new Date(project.deadline).toLocaleDateString()}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Assigned Tasks</h2>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
        >
          <option value="All">All</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>

      <div className="grid gap-6">
        {filteredTasks.map(task => (
          <div key={task._id} className="bg-white rounded-xl shadow-md p-6 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">{task.title}</h3>
            </div>
            <p className="text-gray-700 text-sm">{task.description}</p>
            <p className="text-xs text-gray-400">Deadline: {new Date(task.deadline).toLocaleDateString()}</p>

            <TaskCard
              task={task}
              onUpdateStatus={(newStatus) => handleUpdateStatus(task._id, newStatus)}
              showDropdown={true}
            />

            <div className="bg-gray-100 rounded p-3 mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Comments:</h4>
              {comments[task._id]?.length > 0 ? (
                comments[task._id].map((comment, index) => (
                  <div key={index} className="text-sm text-gray-800 border-b py-1 last:border-b-0">
                    {comment.text}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">No comments yet.</p>
              )}
            </div>

            <button
              onClick={() =>
                setIsCommenting(prev => ({ ...prev, [task._id]: !prev[task._id] }))
              }
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-md text-sm transition"
            >
              {isCommenting[task._id] ? 'Cancel' : 'Add Comment'}
            </button>

            {isCommenting[task._id] && (
              <div className="mt-3">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full p-2 border rounded-md text-sm mb-2 focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="Write your comment..."
                />
                <button
                  onClick={() => handleAddComment(task._id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm transition"
                >
                  Add Comment
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
