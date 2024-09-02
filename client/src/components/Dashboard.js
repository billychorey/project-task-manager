import React, { useState, useEffect } from 'react';
import SimpleForm from './SimpleForm';

function Dashboard() {
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState(null);
    const [editingProject, setEditingProject] = useState(null);

    useEffect(() => {
        fetch('http://127.0.0.1:5000/projects')
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to fetch projects');
                }
                return res.json();
            })
            .then((data) => {
                if (Array.isArray(data)) {
                    setProjects(data);
                } else {
                    console.error('Unexpected response format:', data);
                    setError('Failed to fetch projects');
                }
            })
            .catch((err) => {
                console.error('Error fetching projects:', err);
                setError('Failed to fetch projects');
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
        .then((res) => {
            if (!res.ok) {
                return res.json().then((error) => { throw new Error(error.error); });
            }
            return res.json();
        })
        .then((data) => {
            setProjects([...projects, data]);
            setError(null);
        })
        .catch((err) => {
            console.error('Error creating project:', err);
            setError('Failed to create project');
        });
    };

    const handleDeleteProject = (projectId) => {
        fetch(`http://127.0.0.1:5000/projects/${projectId}`, {
            method: 'DELETE',
        })
        .then((res) => {
            if (!res.ok) {
                throw new Error('Failed to delete project');
            }
            setProjects(projects.filter((project) => project.id !== projectId));
        })
        .catch((err) => {
            console.error('Error deleting project:', err);
            setError('Failed to delete project');
        });
    };

    const handleEditProject = (projectId) => {
        const projectToEdit = projects.find((project) => project.id === projectId);
        setEditingProject({ ...projectToEdit });
    };

    const handleUpdateProject = () => {
        fetch(`http://127.0.0.1:5000/projects/${editingProject.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editingProject),
        })
        .then((res) => {
            if (!res.ok) {
                throw new Error('Failed to update project');
            }
            return res.json();
        })
        .then((updatedProject) => {
            setProjects(
                projects.map((project) =>
                    project.id === updatedProject.id ? updatedProject : project
                )
            );
            setEditingProject(null);
            setError(null);
        })
        .catch((err) => {
            console.error('Error updating project:', err);
            setError('Failed to update project');
        });
    };

    return (
        <div>
            <h1>Projects</h1>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <SimpleForm onSubmit={handleCreateProject} />
            <ul>
                {projects.map((project) => (
                    <li key={project.id}>
                        {editingProject && editingProject.id === project.id ? (
                            <div>
                                <input
                                    type="text"
                                    value={editingProject.title}
                                    onChange={(e) =>
                                        setEditingProject({ ...editingProject, title: e.target.value })
                                    }
                                />
                                <textarea
                                    value={editingProject.description}
                                    onChange={(e) =>
                                        setEditingProject({ ...editingProject, description: e.target.value })
                                    }
                                />
                                <button onClick={handleUpdateProject}>Save</button>
                                <button onClick={() => setEditingProject(null)}>Cancel</button>
                            </div>
                        ) : (
                            <div>
                                <h2>{project.title}</h2>
                                <p>{project.description}</p>
                                <button onClick={() => handleEditProject(project.id)}>Edit</button>
                                <button onClick={() => handleDeleteProject(project.id)}>Delete</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Dashboard;
