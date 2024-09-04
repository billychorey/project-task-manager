// taskUtils.js

export const handleAssignTask = (projectId, taskData, setProject) => {
  fetch(`http://127.0.0.1:5000/edit/${projectId}/assign_employee`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData),
  })
    .then((res) => res.json())
    .then((newTask) => {
      setProject((prevProject) => ({
        ...prevProject,
        tasks: [...prevProject.tasks, newTask],
      }));
    })
    .catch((error) => console.error('Error assigning task:', error));
};
