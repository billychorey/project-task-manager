import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const EmployeeDetails = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/employees')
      .then((response) => response.json())
      .then((data) => setEmployees(data))
      .catch((error) => console.error('Error fetching employees:', error));
  }, []);

  // Formik and Yup
  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Employee name is required')
      .min(3, 'Name must be at least 3 characters long')
      .max(50, 'Name cannot exceed 50 characters'),
  });

  // Handle adding a new employee
  const handleAddEmployee = (values, { resetForm }) => {
    const newEmployee = { name: values.name };

    fetch('http://127.0.0.1:5000/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEmployee),
    })
      .then((response) => response.json())
      .then((employee) => {
        setEmployees([...employees, employee]);
        resetForm();  // Reset form after successful submission
      })
      .catch((error) => console.error('Error adding employee:', error));
  };

  // Handle deleting an employee
  const handleDeleteEmployee = (employeeId) => {
    fetch(`http://127.0.0.1:5000/employees/${employeeId}`, {
      method: 'DELETE',
    })
      .then(() => {
        setEmployees(employees.filter((employee) => employee.id !== employeeId));
      })
      .catch((error) => console.error('Error deleting employee:', error));
  };

  return (
    <div>
      {/* Employee List with Delete Option */}
      <h1>Employees</h1>
      <ul>
        {employees.length > 0 ? (
          employees.map((employee) => (
            <li key={employee.id}>
              {employee.name} <button onClick={() => handleDeleteEmployee(employee.id)}>Remove Employee</button>
            </li>
          ))
        ) : (
          <p>No employees available</p>
        )}
          </ul>
          {/* Add New Employee Section with Formik */}
      <div>
        <h2>Add New Employee</h2>
        <Formik
          initialValues={{ name: '' }}
          validationSchema={validationSchema}
          onSubmit={handleAddEmployee}
        >
          {({ isSubmitting }) => (
            <Form>
              <div>
                <label htmlFor="name">Employee Name:</label>
                <Field name="name" type="text" placeholder="Employee Name" />
                <ErrorMessage name="name" component="div" className="error" />
              </div>
              <button type="submit" disabled={isSubmitting}>
                Add Employee
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EmployeeDetails;
