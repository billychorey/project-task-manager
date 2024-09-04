import React, { useState, useEffect } from 'react';

const EmployeeDetails = () => {
  const [employees, setEmployees] = useState([]);
  const [newEmployeeName, setNewEmployeeName] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:5000/employees')
      .then((response) => response.json())
      .then((data) => setEmployees(data))
      .catch((error) => console.error('Error fetching employees:', error));
  }, []);

  // Handle adding a new employee
  const handleAddEmployee = () => {
    if (!newEmployeeName) {
      alert("Employee name cannot be empty.");
      return;
    }

    const newEmployee = { name: newEmployeeName };

    fetch('http://127.0.0.1:5000/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEmployee),
    })
      .then((response) => response.json())
      .then((employee) => {
        setEmployees([...employees, employee]);
        setNewEmployeeName('');
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
      <h1>Employee Details</h1>

      {/* Add New Employee Section */}
      <div>
        <h2>Add New Employee</h2>
        <input
          type="text"
          value={newEmployeeName}
          onChange={(e) => setNewEmployeeName(e.target.value)}
          placeholder="Employee Name"
        />
        <button onClick={handleAddEmployee}>Add Employee</button>
      </div>

      {/* Employee List with Delete Option */}
      <h2>Employee List</h2>
      <ul>
        {employees.length > 0 ? (
          employees.map((employee) => (
            <li key={employee.id}>
              {employee.name} <button onClick={() => handleDeleteEmployee(employee.id)}>Delete</button>
            </li>
          ))
        ) : (
          <p>No employees available</p>
        )}
      </ul>
    </div>
  );
};

export default EmployeeDetails;
