import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const TaskForm = ({ onSubmit, projectId, employees, taskDescription = '', selectedEmployeeId = '' }) => {
  // Validation schema using Yup
  const validationSchema = Yup.object({
    description: Yup.string()
      .required('Task description is required')
      .min(5, 'Task description must be at least 5 characters long'),
    employee_id: Yup.string().required('You must select an employee'),
  });

  return (
    <div>
      <h3>Add tasks to project</h3>
      <Formik
        initialValues={{
          description: taskDescription || '',
          employee_id: selectedEmployeeId || '',
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          onSubmit(projectId, values); // Call the provided onSubmit function
          resetForm(); // Reset form after successful submission
          setSubmitting(false); // Turn off the submitting state
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label htmlFor="description">Task Description:</label>
              <Field name="description" type="text" />
              <ErrorMessage name="description" component="div" style={{ color: 'red' }} />
            </div>

            <div>
              <label htmlFor="employee_id">Assign Employee:</label>
              <Field as="select" name="employee_id">
                <option value="">Select Employee</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="employee_id" component="div" style={{ color: 'red' }} />
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Assigning...' : 'Assign Task'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default TaskForm;
