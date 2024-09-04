import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function ProjectDetails() {
  const { projectId } = useParams(); // Get projectId from URL
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Fetch the project details using projectId
    fetch(`/projects/${projectId}`)
      .then(response => response.json())
      .then(data => setProject(data))
      .catch(error => console.error('Error fetching project:', error));

    // Fetch the tasks for this project
    fetch(`/projects/${projectId}/tasks`)
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(error => console.error('Error fetching tasks:', error));
  }, [projectId]);

  if (!project) return <div>Loading...</div>;

  return (
    <div>
      <h2>{project.title}</h2>
      <p>{project.description}</p>

      <h3>Tasks:</h3>
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
    </div>
  );
}

export default ProjectDetails;
