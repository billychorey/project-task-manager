import React, { useState, useEffect } from 'react';

function ProjectDetails() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Fetch the list of projects along with their tasks and employees from the backend
    fetch('http://127.0.0.1:5000/projects')
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error('Error fetching projects:', error));
  }, []);

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
                    </li>
                  ))
                ) : (
                  <p>No tasks available for this project.</p>
                )}
              </ul>
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
