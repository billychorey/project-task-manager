// EditProjectForm.js
import React, { useState } from 'react';

const EditProjectForm = ({ project, onUpdate }) => {
    const [title, setTitle] = useState(project.title || '');
    const [description, setDescription] = useState(project.description || '');
    const [error, setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch(`http://127.0.0.1:5000/projects/${project.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, description }),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.error) {
                setError(data.error);
            } else {
                onUpdate(data);
                setError(null);
            }
        })
        .catch((err) => {
            console.error('Error updating project:', err);
            setError('Failed to update project');
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Title</label>
                <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                />
            </div>
            <div>
                <label>Description</label>
                <textarea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <button type="submit">Update Project</button>
        </form>
    );
};

export default EditProjectForm;
