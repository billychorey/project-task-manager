import React, { useState, useEffect } from 'react';

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [employees, setEmployees] = useState([]); 
    const [newProjectTitle, setNewProjectTitle] = useState('');
    const [newProjectDescription, setNewProjectDescription] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState({});
    const [editProjectId, setEditProjectId] = useState(null);  // New state to track the project being edited

    useEffect(() => {
        fetch('http://127.0.0.1:5000/projects')
            .then(res => res.json())
            .then(data => {
                console.log('Fetched projects:', data);
                setProjects(data);
            })
            .catch(error => console.error('Error fetching projects:', error));

        fetch('http://127.0.0.1:5000/employees')
            .then(res => res.json())
            .then(data => {
                console.log('Fetched employees:', data);
                setEmployees(data);
            })
            .catch(error => console.error('Error fetching employees:', error));
    }, []);

    const handleAddProject = () => {
        if (editProjectId !== null) {
            handleEditProject(editProjectId);
            return;
        }

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
                setEditProjectId(null);  // Clear edit mode
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

    const startEditingProject = (projectId) => {
        const project = projects.find(p => p.id === projectId);
        if (project) {
            setNewProjectTitle(project.title);
            setNewProjectDescription(project.description);
            setEditProjectId(projectId);
        }
    };

    const handleAssignEmployee = (projectId) => {
        const employeeId = selectedEmployee[projectId];

        if (!employeeId) {
            alert("Please select an employee.");
            return;
        }

        fetch(`http://127.0.0.1:5000/projects/${projectId}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ employee_id: employeeId, description: "Assigned task" })
        })
            .then(res => res.json())
            .then(task => {
                setProjects(projects.map(p => 
                    p.id === projectId ? { ...p, tasks: [...p.tasks, task] } : p
                ));
            })
            .catch(error => console.error('Error assigning employee:', error));
    };

    const handleEmployeeChange = (projectId, employeeId) => {
        setSelectedEmployee({
            ...selectedEmployee,
            [projectId]: employeeId
        });
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
            <button onClick={handleAddProject}>
                {editProjectId !== null ? "Save Changes" : "Add Project"}
            </button>

            <ul>
                {Array.isArray(projects) ? projects.map(project => (
                    <li key={project.id}>
                        <h2>{project.title}</h2>
                        <p>{project.description}</p>
                        <select onChange={(e) => handleEmployeeChange(project.id, e.target.value)}>
                            <option value="">Select Employee</option>
                            {employees.map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.name}</option>
                            ))}
                        </select>
                        <button onClick={() => handleAssignEmployee(project.id)}>Assign Employee</button>
                        <button onClick={() => startEditingProject(project.id)}>Edit</button>
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
