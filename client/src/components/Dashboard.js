import React, { useState, useEffect } from 'react';

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [newProjectTitle, setNewProjectTitle] = useState('');
    const [newProjectDescription, setNewProjectDescription] = useState('');
    const [editProjectId, setEditProjectId] = useState(null);

    useEffect(() => {
        fetch('http://127.0.0.1:5000/projects')
            .then(res => res.json())
            .then(data => {
                console.log('Fetched projects:', data);
                setProjects(data);
            })
            .catch(error => console.error('Error fetching projects:', error));
    }, []);

    const handleAddProject = () => {
        const newProject = {
            title: newProjectTitle,
            description: newProjectDescription
        };

        fetch('http://127.0.0.1:5000/projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProject)
        })
            .then(res => res.json())
            .then(project => {
                setProjects([...projects, project]);
                setNewProjectTitle('');
                setNewProjectDescription('');
            })
            .catch(error => console.error('Error adding project:', error));
    };

    const handleEditProject = (project) => {
        setEditProjectId(project.id);
        setNewProjectTitle(project.title);
        setNewProjectDescription(project.description);
    };

    const handleSaveEditProject = () => {
        const updatedProject = {
            title: newProjectTitle,
            description: newProjectDescription
        };

        fetch(`http://127.0.0.1:5000/projects/${editProjectId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedProject)
        })
            .then(res => res.json())
            .then(updated => {
                setProjects(projects.map(p => (p.id === editProjectId ? updated : p)));
                setEditProjectId(null);
                setNewProjectTitle('');
                setNewProjectDescription('');
            })
            .catch(error => console.error('Error editing project:', error));
    };

    const handleDeleteProject = (projectId) => {
        fetch(`http://127.0.0.1:5000/projects/${projectId}`, {
            method: 'DELETE',
        })
            .then(() => {
                setProjects(projects.filter(p => p.id !== projectId));
            })
            .catch(error => console.error('Error deleting project:', error));
    };

    return (
        <div>
            <h1>Projects Dashboard</h1>
            <input
                type="text"
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
                placeholder="Project Title"
            />
            <input
                type="text"
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
                placeholder="Project Description"
            />
            {editProjectId ? (
                <button onClick={handleSaveEditProject}>Save Project</button>
            ) : (
                <button onClick={handleAddProject}>Add Project</button>
            )}

            <ul>
                {Array.isArray(projects) ? projects.map(project => (
                    <li key={project.id}>
                        <h2>{project.title}</h2>
                        <p>{project.description}</p>
                        <button onClick={() => handleEditProject(project)}>Edit</button>
                        <button onClick={() => handleDeleteProject(project.id)}>Delete</button>
                    </li>
                )) : <p>No projects available</p>}
            </ul>
        </div>
    );
};

export default Dashboard;
