import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './Dashboard';  
import ProjectList from './ProjectList';  
import TaskManagement from './TaskManagement';  
import EmployeeDetails from './EmployeeDetails';  
import ProjectDetails from './ProjectDetails'; // Import ProjectDetails for showing single project

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navbar */}
        <nav>
          <ul>
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/employees">Employees</Link></li>
            <li><Link to="/projects">Edit Projects</Link></li>
          </ul>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<ProjectList />} />  {/* Project List Route */}
          <Route path="/projects/:projectId" element={<ProjectDetails />} /> {/* Dynamic route for individual project */}
          <Route path="/tasks" element={<TaskManagement />} />
          <Route path="/employees" element={<EmployeeDetails />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;
