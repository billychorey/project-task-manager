import React, { useEffect, useState } from 'react';

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [tasks, setTasks] = useState([]);
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [selectedEmployeeForTask, setSelectedEmployeeForTask] = useState('');
  const [employees, setEmployees] = useState([]);
  const [newProjectFormVisible, setNewProjectFormVisible] = useState(false);

  useEffect(() => {
    fetch('/projects')  
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error('Error fetching projects:', error));
  }, []);

  useEffect(() => {
    fetch('/employees')  
      .then((response) => response.json())
      .then((data) => setEmployees(data))
      .catch((error) => console.error('Error fetching employees:', error));
  }, []);

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setNewProjectTitle(project.title);
    setNewProjectDescription(project.description);

    fetch(`/projects/${project.id}/tasks`)
      .then((response) => response.json())
      .then((data) => setTasks(Array.isArray(data) ? data : []))
      .catch((error) => {
        console.error('Error fetching tasks:', error);
        setTasks([]);
      });
  };

  const handleSaveProject = () => {
    fetch(`/projects/${selectedProject.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: newProjectTitle,
        description: newProjectDescription,
      }),
    })
      .then((response) => response.json())
      .then((updatedProject) => {
        setProjects((prevProjects) =>
          prevProjects.map((project) =>
            project.id === updatedProject.id ? updatedProject : project
          )
        );
        setSelectedProject(null);
      })
      .catch((error) => console.error('Error saving project:', error));
  };

  const handleAddTask = () => {
    if (!selectedEmployeeForTask || !newTaskDescription) {
      alert('Please select an employee and provide a task description.');
      return;
    }

    fetch(`/projects/${selectedProject.id}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: newTaskDescription,
        employee_id: selectedEmployeeForTask,
      }),
    })
      .then((response) => response.json())
      .then((newTask) => {
        setTasks([...tasks, newTask]);  
        setNewTaskDescription('');  
        setSelectedEmployeeForTask('');  
      })
      .catch((error) => console.error('Error adding task:', error));
  };

  const handleAddNewProject = () => {
    fetch('/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: newProjectTitle,
        description: newProjectDescription,
      }),
    })
      .then((response) => response.json())
      .then((newProject) => {
        setProjects([...projects, newProject]);  
        setNewProjectTitle('');
        setNewProjectDescription('');
        setNewProjectFormVisible(false); 
      })
      .catch((error) => console.error('Error adding new project:', error));
  };

  const handleDeleteProject = (projectId) => {
    fetch(`/projects/${projectId}`, {
      method: 'DELETE',
    })
      .then(() => {
        setProjects(projects.filter((project) => project.id !== projectId));
        if (selectedProject && selectedProject.id === projectId) {
          setSelectedProject(null);  
        }
      })
      .catch((error) => console.error('Error deleting project:', error));
  };

  return (
    <div>
      <h1>Edit Projects</h1>
      {projects.length === 0 ? (
        <p>No projects available.</p>
      ) : (
        <ul>
          {projects.map((project) => (
            <li key={project.id}>
              {project.title}{' '}
              <button onClick={() => handleProjectSelect(project)}>Edit</button>{' '}
              <button onClick={() => handleDeleteProject(project.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}

      {newProjectFormVisible ? (
        <div>
          <h2>Create New Project</h2>
          <input
            type="text"
            placeholder="Project Title"
            value={newProjectTitle}
            onChange={(e) => setNewProjectTitle(e.target.value)}
          />
          <textarea
            placeholder="Project Description"
            value={newProjectDescription}
            onChange={(e) => setNewProjectDescription(e.target.value)}
          />
          <button onClick={handleAddNewProject}>Create Project</button>
        </div>
      ) : (
        <button onClick={() => setNewProjectFormVisible(true)}>
          Add New Project
        </button>
      )}

      {selectedProject && (
        <div>
          <h2>Editing: {selectedProject.title}</h2>
          <input
            type="text"
            placeholder="Project Title"
            value={newProjectTitle}
            onChange={(e) => setNewProjectTitle(e.target.value)}
          />
          <textarea
            placeholder="Project Description"
            value={newProjectDescription}
            onChange={(e) => setNewProjectDescription(e.target.value)}
          />
          <button onClick={handleSaveProject}>Save Project</button>

          <h3>Tasks for {selectedProject.title}</h3>
          {tasks.length === 0 ? (
            <p>No tasks assigned to this project yet.</p>
          ) : (
            <ul>
              {tasks.map((task) => (
                <li key={task.id}>
                  {task.description} - Assigned to: {task.employee_name}
                </li>
              ))}
            </ul>
          )}

          <h3>Assign New Task</h3>
          <input
            type="text"
            placeholder="Task Description"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
          />
          <select
            value={selectedEmployeeForTask}
            onChange={(e) => setSelectedEmployeeForTask(e.target.value)}
          >
            <option value="">Select Employee</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>
          <button onClick={handleAddTask}>Add Task</button>
        </div>
      )}
    </div>
  );
}

export default ProjectList;
