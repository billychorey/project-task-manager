import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function ProjectDetails() {
  const { id } = useParams();  // Get the project ID from the URL
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/projects/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setProject(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!project) {
    return <div>No project found.</div>;
  }

  return (
    <div>
      <h1>Project Details</h1>
      <h2>{project.title}</h2>
      <p>{project.description}</p>
      {/* Add more details here if available */}
    </div>
  );
}

export default ProjectDetails;
