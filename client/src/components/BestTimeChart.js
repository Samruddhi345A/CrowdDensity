import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, XAxis, YAxis, Tooltip, Bar, CartesianGrid, ResponsiveContainer } from 'recharts';

const BestTimeChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/footfall/summary/best-time')
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Best Time to Visit (Least Footfall)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BestTimeChart;
