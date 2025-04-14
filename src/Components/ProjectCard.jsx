// components/ProjectCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProjectCard({ project }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/project/${project._id}`)}
      className="cursor-pointer bg-white rounded-xl shadow p-4 hover:shadow-lg transition"
    >
      <h2 className="text-lg font-bold">{project.title}</h2>
      <p className="text-sm text-gray-600 mt-1">
        {project.description?.slice(0, 100)}...
      </p>
      <p className="text-xs text-gray-400 mt-2">
        Deadline: {project.deadline?.split('T')[0]}
      </p>
    </div>
  );
}
