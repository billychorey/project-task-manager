import React, { useState, useEffect } from 'react';

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [newProjectTitle, setNewProjectTitle] = useState('');
    const [newProjectDescription, setNewProjectDescription] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState('');
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

    const handleEditProject = (projectId) => {
        const updatedProject = {
            title: newProjectTitle,
            description: newProjectDescription
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
                setNewProjectTitle('');
                setNewProjectDescription('');
            })
            .catch(error => console.error('Error editing project:', error));
    };

    const handleAssignTask = (projectId) => {
        const newTask = {
            description: taskDescription,
            employee_id: selectedEmployee
        };

        fetch(`http://127.0.0.1:5000/projects/${projectId}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTask)
        })
            .then(res => res.json())
            .then(task => {
                setProjects(projects.map(p => 
                    p.id === projectId 
                    ? { ...p, tasks: [...p.tasks, task] } 
                    : p
                ));
                setTaskDescription('');
                setSelectedEmployee('');
            })
            .catch(error => console.error('Error assigning task:', error));
    };

    return (
        <div>
            <h1>Projects Dashboard</h1>
            <div>
                <label>
                    Project Name:
                    <input
                        type="text"
                        value={newProjectTitle}
                        onChange={(e) => setNewProjectTitle(e.target.value)}
                        placeholder="Project Title"
                    />
                </label>
                <label>
                    Project Description:
                    <input
                        type="text"
                        value={newProjectDescription}
                        onChange={(e) => setNewProjectDescription(e.target.value)}
                        placeholder="Project Description"
                    />
                </label>
                <button onClick={handleAddProject}>Add Project</button>
            </div>

            <ul>
                {Array.isArray(projects) ? projects.map(project => (
                    <li key={project.id}>
                        <h2>{project.title}</h2>
                        <p>{project.description}</p>
                        <div>
                            <label>
                                Employee:
                                <select 
                                    value={selectedEmployee}
                                    onChange={(e) => setSelectedEmployee(e.target.value)}
                                >
                                    <option value="">Select Employee</option>
                                    {employees.map(emp => (
                                        <option key={emp.id} value={emp.id}>
                                            {emp.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                Task Description:
                                <input
                                    type="text"
                                    value={taskDescription}
                                    onChange={(e) => setTaskDescription(e.target.value)}
                                    placeholder="Task Description"
                                />
                            </label>
                            <button onClick={() => handleAssignTask(project.id)}>Assign Task</button>
                        </div>
                        <button onClick={() => handleEditProject(project.id)}>Edit</button>
                        <button onClick={() => handleDeleteProject(project.id)}>Delete</button>
                        <ul>
                            {project.tasks && project.tasks.map(task => (
                                <li key={task.id}>
                                    {task.description} - {task.employee.name}
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
