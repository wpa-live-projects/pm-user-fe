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
    <div className="p-6">
      {project && (
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{project.title}</h1>
          <p className="text-gray-600 mb-1">{project.description}</p>
          <p className="text-sm text-gray-500">Deadline: {new Date(project.deadline).toLocaleDateString()}</p>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-2">Assigned Tasks</h2>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded text-sm"
        >
          <option value="All">All</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>

      <div className="grid gap-4 mt-4">
        {/* Display tasks inside a box with comments */}
        {filteredTasks.map(task => (
          <div key={task._id} className="bg-white rounded-xl shadow p-4 mb-4">
            {/* Task Card */}
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
              {/* Add StatusTag component here if needed */}
            </div>
            <p className="text-gray-600 text-sm mb-2">{task.description}</p>
            <p className="text-xs text-gray-400">Deadline: {new Date(task.deadline).toLocaleDateString()}</p>

            <TaskCard
              task={task}
              onUpdateStatus={(newStatus) => handleUpdateStatus(task._id, newStatus)}
              showDropdown={true}
            />

            {/* Comments section inside the same box */}
            <div className="mt-2 bg-gray-100 p-3 rounded">
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Comments:</h4>
              {comments[task._id]?.length > 0 ? (
                comments[task._id].map((comment, index) => (
                  <div key={index} className="text-sm text-gray-800 border-b py-1">
                    {comment.text}
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500 italic">No comments yet.</div>
              )}
            </div>

            {/* Toggle comment input */}
            <button
              onClick={() => {
                const isOpen = !isCommenting[task._id];
                setIsCommenting((prev) => ({ ...prev, [task._id]: isOpen }));
              }}
              className="mt-2 bg-green-500 text-white px-4 py-1 rounded text-sm hover:bg-green-600"
            >
              {isCommenting[task._id] ? 'Cancel' : 'Add Comment'}
            </button>

            {/* Comment input */}
            {isCommenting[task._id] && (
              <div className="mt-2">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="border p-2 w-full rounded mb-2"
                  placeholder="Write your comment..."
                />
                <button
                  onClick={() => handleAddComment(task._id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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
