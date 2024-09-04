import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

const Dashboard = () => {
  const [projects, setProjects] = useState([]);

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
              <h2>
                <Link to={`/projects/${project.id}`}>{project.title}</Link> {/* Link to project details */}
              </h2>
              <p>{project.description}</p>
            </li>
          ))
        ) : (
          <p>No projects available.</p>
        )}
      </ul>
      <Link to="/edit">Edit Projects</Link>  {/* Added link to /edit for editing all projects */}
    </div>
  );
};

export default Dashboard;
