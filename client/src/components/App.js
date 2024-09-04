import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './Dashboard';  // Assuming Dashboard.js exists
import ProjectDetails from './ProjectDetails';  // Assuming ProjectDetails.js exists
import TaskManagement from './TaskManagement';  // Assuming TaskManagement.js exists
import EmployeeDetails from './EmployeeDetails';  // Ensure this is correctly imported

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navbar */}
        <nav>
          <ul>
            <li><Link to="/">Dashboard</Link></li>  {/* Link to Dashboard */}
            <li><Link to="/employees">Employees</Link></li>  {/* Link to Employees */}
            <li><Link to="/projects">Projects</Link></li>  {/* Link to Projects */}
          </ul>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Dashboard />} />  {/* Dashboard Route */}
          <Route path="/projects" element={<ProjectDetails />} />  {/* Projects Route */}
          <Route path="/tasks" element={<TaskManagement />} />  {/* Task Management Route */}
          <Route path="/employees" element={<EmployeeDetails />} />  {/* Employees Route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
