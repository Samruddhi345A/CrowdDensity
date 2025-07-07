import React from 'react';
import DepartmentChart from './components/DepartmentChart';
import BestTimeChart from './components/BestTimeChart';
import Scheduler from './components/Schedular';

function App() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>🛒 Crowd Analytics Dashboard</h1>
      <DepartmentChart />
      <BestTimeChart />
      <Scheduler/>
    </div>
  );
}

export default App;
