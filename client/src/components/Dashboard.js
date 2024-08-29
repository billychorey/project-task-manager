import React, { useState, useEffect } from 'react';
import SimpleForm from './SimpleForm';
import EditProjectForm from './EditProjectForm';

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/projects')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleCreateProject = (newProject) => {
    fetch('http://127.0.0.1:5000/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProject),
    })
      .then((response) => response.json())
      .then((createdProject) => {
        setProjects([...projects, createdProject]);
      })
      .catch((error) => setError(error.message));
  };

  const handleUpdateProject = (updatedProject) => {
    fetch(`http://127.0.0.1:5000/projects/${updatedProject.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProject),
    })
      .then((response) => response.json())
      .then((data) => {
        setProjects(
          projects.map((project) =>
            project.id === updatedProject.id ? updatedProject : project
          )
        );
        setEditingProject(null);
      })
      .catch((error) => setError(error.message));
  };

  const handleDeleteProject = (projectId) => {
    fetch(`http://127.0.0.1:5000/projects/${projectId}`, {
      method: 'DELETE',
    })
      .then(() => {
        setProjects(projects.filter((project) => project.id !== projectId));
      })
      .catch((error) => setError(error.message));
  };

  const startEditingProject = (project) => {
    setEditingProject(project);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      {editingProject ? (
        <EditProjectForm
          project={editingProject}
          onSubmit={handleUpdateProject}
        />
      ) : (
        <SimpleForm onSubmit={handleCreateProject} />
      )}
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            {project.title}
            <button onClick={() => startEditingProject(project)}>Edit</button>
            <button onClick={() => handleDeleteProject(project.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
