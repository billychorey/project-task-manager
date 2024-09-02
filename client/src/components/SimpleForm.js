import React, { useState, useEffect } from 'react';

function SimpleForm({ onSubmit, project }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Update form fields when the project prop changes
  useEffect(() => {
    if (project) {
      setTitle(project.title || '');
      setDescription(project.description || '');
    }
  }, [project]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const updatedProject = { ...project, title, description };
    onSubmit(updatedProject);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <button type="submit">{project?.id ? 'Update Project' : 'Create Project'}</button>
    </form>
  );
}

export default SimpleForm;
