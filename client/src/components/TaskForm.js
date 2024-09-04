import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const TaskForm = ({ onSubmit, projectId, employees, taskDescription = '', selectedEmployeeId = '' }) => {

  // Formik validation schema
  const validationSchema = Yup.object({
    description: Yup.string().required('Task description is required'),
    employee_id: Yup.string().required('Please select an employee'),
  });

  return (
    <Formik
      initialValues={{
        description: taskDescription,
        employee_id: selectedEmployeeId,
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        onSubmit(projectId, values);
        setSubmitting(false);
        resetForm(); // Clear the form after submission
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <div>
            <label htmlFor="description">Task Description:</label>
            <Field
              name="description"
              type="text"
              placeholder="Enter task description"
            />
            <ErrorMessage name="description" component="div" style={{ color: 'red' }} />
          </div>

          <div>
            <label htmlFor="employee_id">Assign Employee:</label>
            <Field name="employee_id" as="select">
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
            Assign Task
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default TaskForm;
