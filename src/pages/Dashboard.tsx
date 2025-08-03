import React from 'react';
import { toast } from 'react-toastify';

const Dashboard = () => {
  return (
    <div>
      <button onClick={() => toast('Hello')}>Click</button>
    </div>
  );
};

export default Dashboard;
