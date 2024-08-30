import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
        console.error('Error fetching projects:', error);
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
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to create project');
        }
        return response.json();
      })
      .then((createdProject) => {
        setProjects([...projects, createdProject]);
      })
      .catch((error) => {
        console.error('Error creating project:', error);
        setError(error.message);
      });
  };

  const handleUpdateProject = (updatedProject) => {
    console.log('Updating Project:', updatedProject);
    fetch(`http://127.0.0.1:5000/projects/${updatedProject.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProject),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update project');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Updated Project Response:', data);
        setProjects(
          projects.map((project) =>
            project.id === updatedProject.id ? updatedProject : project
          )
        );
        setEditingProject(null);
      })
      .catch((error) => {
        console.error('Error updating project:', error);
        setError(error.message);
      });
  };

  const handleDeleteProject = (projectId) => {
    fetch(`http://127.0.0.1:5000/projects/${projectId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete project');
        }
        setProjects(projects.filter((project) => project.id !== projectId));
      })
      .catch((error) => {
        console.error('Error deleting project:', error);
        setError(error.message);
      });
  };

  const startEditingProject = (project) => {
    console.log('Editing Project:', project);
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
            <Link to={`/projects/${project.id}`}>{project.title}</Link>
            <button onClick={() => startEditingProject(project)}>Edit</button>
            <button onClick={() => handleDeleteProject(project.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
