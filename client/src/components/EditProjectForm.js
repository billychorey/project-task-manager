import React, { useState, useEffect } from 'react';

function EditProjectForm({ project, onSubmit }) {
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);

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
      <button type="submit">Update Project</button>
    </form>
  );
}

export default EditProjectForm;
