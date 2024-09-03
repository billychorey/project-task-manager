import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [newProjectTitle, setNewProjectTitle] = useState('');
    const [newProjectDescription, setNewProjectDescription] = useState('');
    const [taskDescriptions, setTaskDescriptions] = useState({});
    const [selectedEmployees, setSelectedEmployees] = useState({});
    const [editMode, setEditMode] = useState({});
    const [editedProjectTitle, setEditedProjectTitle] = useState({});
    const [editedProjectDescription, setEditedProjectDescription] = useState({});
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:5000/projects')
            .then(res => res.json())
            .then(data => setProjects(data))
            .catch(error => console.error('Error fetching projects:', error));

        fetch('http://127.0.0.1:5000/employees')
            .then(res => res.json())
            .then(data => setEmployees(data))
            .catch(error => console.error('Error fetching employees:', error));
    }, []);

    const handleAddProject = () => {
    // Check if the project title and description are not empty
    if (!newProjectTitle.trim() || !newProjectDescription.trim()) {
        alert("Please provide both a project title and description.");
        return;
    }

    const newProject = {
        title: newProjectTitle,
        description: newProjectDescription,
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


    const handleEditProject = (projectId) => {
        const updatedProject = {
            title: editedProjectTitle[projectId] || '',
            description: editedProjectDescription[projectId] || '',
        };

        fetch(`http://127.0.0.1:5000/projects/${projectId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedProject)
        })
            .then(res => res.json())
            .then(updated => {
                setProjects(projects.map(p => (p.id === projectId ? updated : p)));
                setEditMode({ ...editMode, [projectId]: false });
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

    const handleTaskDescriptionChange = (projectId, description) => {
        setTaskDescriptions({
            ...taskDescriptions,
            [projectId]: description,
        });
    };

    const handleEmployeeSelection = (projectId, employeeId) => {
        setSelectedEmployees({
            ...selectedEmployees,
            [projectId]: employeeId,
        });
    };

    const handleAssignEmployee = (projectId) => {
    // Check if the task description is not empty and an employee is selected
    if (!taskDescriptions[projectId]?.trim() || !selectedEmployees[projectId]) {
        alert("Please provide a task description and select an employee.");
        return;
    }

    const assignment = {
        employee_id: selectedEmployees[projectId],
        description: taskDescriptions[projectId],
    };

    fetch(`http://127.0.0.1:5000/projects/${projectId}/assign_employee`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(assignment)
    })
        .then(res => res.json())
        .then(() => {
            setTaskDescriptions({
                ...taskDescriptions,
                [projectId]: ''
            });
            setSelectedEmployees({
                ...selectedEmployees,
                [projectId]: null,
            });
            fetch('http://127.0.0.1:5000/projects')
                .then(res => res.json())
                .then(data => setProjects(data))
                .catch(error => console.error('Error re-fetching projects:', error));
        })
        .catch(error => console.error('Error assigning employee:', error));
};


    const handleRemoveEmployee = (taskId) => {
        fetch(`http://127.0.0.1:5000/tasks/${taskId}`, {
            method: 'DELETE',
        })
            .then(() => {
                fetch('http://127.0.0.1:5000/projects')
                    .then(res => res.json())
                    .then(data => setProjects(data))
                    .catch(error => console.error('Error re-fetching projects:', error));
            })
            .catch(error => console.error('Error removing employee:', error));
    };

    const toggleEditMode = (projectId, currentTitle, currentDescription) => {
        setEditMode({ ...editMode, [projectId]: !editMode[projectId] });
        setEditedProjectTitle({ ...editedProjectTitle, [projectId]: currentTitle });
        setEditedProjectDescription({ ...editedProjectDescription, [projectId]: currentDescription });
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
            <button onClick={handleAddProject}>Add Project</button>

            <ul>
                {Array.isArray(projects) ? projects.map(project => (
                    <li key={project.id}>
                        {editMode[project.id] ? (
                            <div>
                                <input
                                    type="text"
                                    value={editedProjectTitle[project.id] || ''}
                                    onChange={(e) => setEditedProjectTitle({ ...editedProjectTitle, [project.id]: e.target.value })}
                                    placeholder="Edit Project Title"
                                />
                                <input
                                    type="text"
                                    value={editedProjectDescription[project.id] || ''}
                                    onChange={(e) => setEditedProjectDescription({ ...editedProjectDescription, [project.id]: e.target.value })}
                                    placeholder="Edit Project Description"
                                />
                                <button onClick={() => handleEditProject(project.id)}>Save</button>
                            </div>
                        ) : (
                            <div>
                                <h2>{project.title}</h2>
                                <p>{project.description}</p>
                            </div>
                        )}
                        <input
                            type="text"
                            value={taskDescriptions[project.id] || ''}
                            onChange={(e) => handleTaskDescriptionChange(project.id, e.target.value)}
                            placeholder="Task Description"
                        />
                        <select
                            onChange={(e) => handleEmployeeSelection(project.id, e.target.value)}
                            value={selectedEmployees[project.id] || ''}
                        >
                            <option value="">Select Employee</option>
                            {employees.map(employee => (
                                <option key={employee.id} value={employee.id}>
                                    {employee.name}
                                </option>
                            ))}
                        </select>
                        <button onClick={() => handleAssignEmployee(project.id)}>Assign Employee</button>
                        <button onClick={() => toggleEditMode(project.id, project.title, project.description)}>Edit</button>
                        <button onClick={() => handleDeleteProject(project.id)}>Delete</button>
                        <ul>
                            {project.tasks.map(task => (
                                <li key={task.id}>
                                    {task.description} - {task.employee.name}
                                    <button onClick={() => handleRemoveEmployee(task.id)}>Remove</button>
                                </li>
                            ))}
                        </ul>
                    </li>
                )) : <p>No projects available</p>}
            </ul>
        </div>
    );
};

export default Dashboard;
