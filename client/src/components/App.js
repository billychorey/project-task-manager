import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './Dashboard';  
import ProjectList from './ProjectList';  // Import ProjectList instead of ProjectDetails
import TaskManagement from './TaskManagement';  
import EmployeeDetails from './EmployeeDetails';  

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navbar */}
        <nav>
          <ul>
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/employees">Employees</Link></li>
            <li><Link to="/edit">Projects</Link></li>  {/* Changed link to /edit */}
          </ul>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/edit" element={<ProjectList />} />  {/* Replace ProjectDetails with ProjectList */}
          <Route path="/tasks" element={<TaskManagement />} />
          <Route path="/employees" element={<EmployeeDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
