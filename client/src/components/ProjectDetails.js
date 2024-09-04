import React, { useState, useEffect } from 'react';
import TaskForm from './TaskForm'; // Import TaskForm

function ProjectDetails() {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    // Fetch the list of projects along with their tasks and employees from the backend
    fetch('http://127.0.0.1:5000/projects')
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error('Error fetching projects:', error));

    // Fetch employees to assign tasks to
    fetch('http://127.0.0.1:5000/employees')
      .then((response) => response.json())
      .then((data) => setEmployees(data))
      .catch((error) => console.error('Error fetching employees:', error));
  }, []);

  const handleAssignTask = (projectId, taskData) => {
    fetch(`http://127.0.0.1:5000/projects/${projectId}/assign_employee`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    })
      .then((res) => res.json())
      .then(() => {
        // Re-fetch projects to refresh the task list
        fetch('http://127.0.0.1:5000/projects')
          .then((response) => response.json())
          .then((data) => setProjects(data))
          .catch((error) => console.error('Error fetching updated projects:', error));
      })
      .catch((error) => console.error('Error assigning task:', error));
  };

  const handleDeleteTask = (taskId) => {
    fetch(`http://127.0.0.1:5000/tasks/${taskId}`, {
      method: 'DELETE',
    })
      .then(() => {
        // Re-fetch projects to refresh the task list after deletion
        fetch('http://127.0.0.1:5000/projects')
          .then((response) => response.json())
          .then((data) => setProjects(data))
          .catch((error) => console.error('Error fetching updated projects:', error));
      })
      .catch((error) => console.error('Error deleting task:', error));
  };

  return (
    <div>
      <h1>Project Details</h1>
      <ul>
        {projects.length > 0 ? (
          projects.map((project) => (
            <li key={project.id}>
              <h2>{project.title}</h2>
              <p>{project.description}</p>

             

              <h3>Tasks:</h3>
              <ul>
                {project.tasks && project.tasks.length > 0 ? (
                  project.tasks.map((task) => (
                    <li key={task.id}>
                      <h4>Task: {task.description}</h4>
                      <p>Assigned Employee: {task.assigned_employee ? task.assigned_employee.name : 'No employee assigned'}</p>
                      <button onClick={() => handleDeleteTask(task.id)}>Delete Task</button>
                    </li>
                  ))
                ) : (
                  <p>No tasks available for this project.</p>
                )}
              </ul>
               {/* Task Form to add a new task */}
              <TaskForm
                onSubmit={handleAssignTask}
                projectId={project.id}
                employees={employees}
              />
            </li>
          ))
        ) : (
          <p>No projects available</p>
        )}
      </ul>
    </div>
  );
}

export default ProjectDetails;
