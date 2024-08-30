import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
      <ul style={{ listStyleType: 'none', display: 'flex', gap: '10px' }}>
        <li>
          <Link to="/">Dashboard</Link>
        </li>
        <li>
          <Link to="/tasks">Task Management</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
