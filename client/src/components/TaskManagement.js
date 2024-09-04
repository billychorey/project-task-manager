import React, { useState, useEffect } from 'react';
import TaskForm from './TaskForm'; // Reusing TaskForm for adding/editing tasks

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [editTaskId, setEditTaskId] = useState(null);

  // Fetch all tasks, employees, and projects when component mounts
  useEffect(() => {
    fetch('http://127.0.0.1:5000/tasks')
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error('Error fetching tasks:', error));

    fetch('http://127.0.0.1:5000/employees')
      .then((res) => res.json())
      .then((data) => setEmployees(data))
      .catch((error) => console.error('Error fetching employees:', error));

    fetch('http://127.0.0.1:5000/edit')
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error('Error fetching projects:', error));
  }, []);

  const handleAddTask = (taskData) => {
    fetch('http://127.0.0.1:5000/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    })
      .then((res) => res.json())
      .then((newTask) => {
        setTasks([...tasks, newTask]);
      })
      .catch((error) => console.error('Error adding task:', error));
  };

  const handleDeleteTask = (taskId) => {
    fetch(`http://127.0.0.1:5000/tasks/${taskId}`, {
      method: 'DELETE',
    })
      .then(() => {
        setTasks(tasks.filter((task) => task.id !== taskId));
      })
      .catch((error) => console.error('Error deleting task:', error));
  };

  const handleEditTask = (taskData) => {
    fetch(`http://127.0.0.1:5000/tasks/${editTaskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    })
      .then((res) => res.json())
      .then((updatedTask) => {
        setTasks(tasks.map((task) => (task.id === editTaskId ? updatedTask : task)));
        setEditTaskId(null); // Reset after editing
      })
      .catch((error) => console.error('Error editing task:', error));
  };

  return (
    <div>
      <h1>Task Management</h1>

      {/* Task Form for adding or editing tasks */}
      <TaskForm
        onSubmit={editTaskId ? handleEditTask : handleAddTask}
        projectId={null}  // Modify if necessary
        employees={employees}
      />

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <p>{task.description}</p>
            <p>Assigned to: {task.assigned_employee ? task.assigned_employee.name : 'No employee assigned'}</p>
            <p>Project: {task.project ? task.project.title : 'No project assigned'}</p>
            <button onClick={() => setEditTaskId(task.id)}>Edit Task</button>
            <button onClick={() => handleDeleteTask(task.id)}>Delete Task</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManagement;
