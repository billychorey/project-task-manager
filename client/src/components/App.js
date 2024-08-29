import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import ProjectDetails from "./ProjectDetails";
import TaskManagement from "./TaskManagement";

function App() {
  // State and effect hooks can be added here in the future
  // const [data, setData] = useState([]);

  // useEffect(() => {
  //   // Future data fetching can be done here
  // }, []);

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact component={Dashboard} />
          <Route path="/projects/:id" component={ProjectDetails} />
          <Route path="/tasks" component={TaskManagement} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
