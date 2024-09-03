import React, { useState, useEffect } from 'react';

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [newProjectTitle, setNewProjectTitle] = useState('');
    const [newProjectDescription, setNewProjectDescription] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState('');

    useEffect(() => {
        fetch('http://127.0.0.1:5000/projects')
            .then(res => res.json())
            .then(data => {
                setProjects(data);
            })
            .catch(error => console.error('Error fetching projects:', error));
        
        fetch('http://127.0.0.1:5000/employees')
            .then(res => res.json())
            .then(data => {
                setEmployees(data);
            })
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

    const handleDeleteProject = (projectId) => {
        fetch(`http://127.0.0.1:5000/projects/${projectId}`, {
            method: 'DELETE',
        })
            .then(() => {
                setProjects(projects.filter(p => p.id !== projectId));
            })
            .catch(error => console.error('Error deleting project:', error));
    };

    const handleAssignEmployee = (projectId) => {
        if (!selectedEmployee) {
            console.error('No employee selected');
            return;
        }

        const assignment = {
            employee_id: selectedEmployee
        };

        fetch(`http://127.0.0.1:5000/projects/${projectId}/assign_employee`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(assignment)
        })
            .then(res => res.json())
            .then(task => {
                const updatedProjects = projects.map(p => {
                    if (p.id === projectId) {
                        return { ...p, tasks: [...p.tasks, task] };
                    }
                    return p;
                });
                setProjects(updatedProjects);
                setSelectedEmployee('');
            })
            .catch(error => console.error('Error assigning employee:', error));
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
                        <h2>{project.title}</h2>
                        <p>{project.description}</p>
                        <select
                            value={selectedEmployee}
                            onChange={(e) => setSelectedEmployee(e.target.value)}
                        >
                            <option value="">Select Employee</option>
                            {employees.map(employee => (
                                <option key={employee.id} value={employee.id}>
                                    {employee.name}
                                </option>
                            ))}
                        </select>
                        <button onClick={() => handleAssignEmployee(project.id)}>Assign Employee</button>
                        <button onClick={() => handleEditProject(project.id)}>Edit</button>
                        <button onClick={() => handleDeleteProject(project.id)}>Delete</button>
                        <ul>
                            {project.tasks.map(task => (
                                <li key={task.id}>{task.description} - {task.employee.name}</li>
                            ))}
                        </ul>
                    </li>
                )) : <p>No projects available</p>}
            </ul>
        </div>
    );
};

export default Dashboard;
