import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';  // For validation

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetch('/projects')  
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error('Error fetching projects:', error));
  }, []);

  useEffect(() => {
    fetch('/employees')  
      .then((response) => response.json())
      .then((data) => setEmployees(data))
      .catch((error) => console.error('Error fetching employees:', error));
  }, []);

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    fetch(`/projects/${project.id}/tasks`)
      .then((response) => response.json())
      .then((data) => setTasks(Array.isArray(data) ? data : []))
      .catch((error) => {
        console.error('Error fetching tasks:', error);
        setTasks([]);
      });
  };

  const handleSaveProject = (values) => {
    fetch(`/projects/${selectedProject.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: values.title,
        description: values.description,
      }),
    })
      .then((response) => response.json())
      .then((updatedProject) => {
        setProjects((prevProjects) =>
          prevProjects.map((project) =>
            project.id === updatedProject.id ? updatedProject : project
          )
        );
        setSelectedProject(null);
      })
      .catch((error) => console.error('Error saving project:', error));
  };

  const handleAddTask = (values) => {
    if (!values.employee_id || !values.description) {
      alert('Please select an employee and provide a task description.');
      return;
    }

    fetch(`/projects/${selectedProject.id}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: values.description,
        employee_id: values.employee_id,
      }),
    })
      .then((response) => response.json())
      .then((newTask) => {
        setTasks([...tasks, newTask]);  
      })
      .catch((error) => console.error('Error adding task:', error));
  };

  const handleDeleteProject = (projectId) => {
    fetch(`/projects/${projectId}`, {
      method: 'DELETE',
    })
      .then(() => {
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project.id !== projectId)
        );
        if (selectedProject && selectedProject.id === projectId) {
          setSelectedProject(null);  // Clear the selected project if it was deleted
        }
      })
      .catch((error) => console.error('Error deleting project:', error));
  };

  // Project Form Validation Schema
  const projectValidationSchema = Yup.object({
    title: Yup.string()
        .required('Project title is required')
        .matches(/^[a-zA-Z0-9 ]*$/, 'Only letters and numbers are allowed'),
    description: Yup.string()
        .required('Project description is required')  // Make description required
        .max(200, 'Description can\'t be longer than 200 characters'),
    });

  // Task Form Validation Schema
  const taskValidationSchema = Yup.object({
    description: Yup.string()
      .required('Task description is required'),
    employee_id: Yup.string()
      .required('Please select an employee'),
  });

  return (
    <div>
      <h1>Projects</h1>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            {project.title}{' '}
            <button onClick={() => handleProjectSelect(project)}>Edit</button>{' '}
            <button onClick={() => handleDeleteProject(project.id)}>Delete</button> {/* Delete project button */}
          </li>
        ))}
      </ul>

      {selectedProject && (
        <div className="edit">
          <h2>Editing: {selectedProject.title}</h2>

          <Formik
            initialValues={{
              title: selectedProject.title,
              description: selectedProject.description,
            }}
            validationSchema={projectValidationSchema}
            onSubmit={handleSaveProject}
          >
            <Form>
              <label htmlFor="title">Title:</label>
              <Field name="title" type="text" />
              <ErrorMessage name="title" component="div" className="error" />

              <label htmlFor="description">Description:</label>
              <Field name="description" as="textarea" />
              <ErrorMessage name="description" component="div" className="error" />

              <button type="submit">Save Project</button>
            </Form>
          </Formik>

          <h3>Tasks for {selectedProject.title}</h3>
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

          <h3>Assign New Task</h3>
          <Formik
            initialValues={{
              description: '',
              employee_id: '',
            }}
            validationSchema={taskValidationSchema}
            onSubmit={handleAddTask}
          >
            <Form>
              <label htmlFor="description">Task Description:</label>
              <Field name="description" type="text" />
              <ErrorMessage name="description" component="div" className="error" />

              <label htmlFor="employee_id">Assign to:</label>
              <Field as="select" name="employee_id">
                <option value="">Select Employee</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="employee_id" component="div" className="error" />

              <button type="submit">Add Task</button>
            </Form>
          </Formik>
        </div>
      )}
    </div>
  );
}

export default ProjectList;
