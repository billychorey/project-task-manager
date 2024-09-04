import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);

  // Fetch projects on component mount
  useEffect(() => {
    fetch('http://127.0.0.1:5000/projects')
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error('Error fetching projects:', error));
  }, []);

  return (
    <div>
      <h1>Current Projects</h1>

      <ul>
        {projects.length > 0 ? (
          projects.map((project) => (
            <li key={project.id}>
              <h2>{project.title}</h2>
              <p>{project.description}</p>
            </li>
          ))
        ) : (
          <p>No projects available.</p>
        )}
      </ul>
    </div>
  );
};

export default Dashboard;
