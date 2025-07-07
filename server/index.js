const express = require('express');
const cors = require('cors');
const app = express();
const footfallRoutes = require('./routes/footfall');
const schedularRoutes = require('./routes/schedular');
const { advanceSimulatedTime } = require('./utils/simulatedTime');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/footfall', footfallRoutes);
app.use('/api/schedule',schedularRoutes);
// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

// Simulate time: advance simulated time every 5 seconds by 1 minute
setInterval(() => {
  advanceSimulatedTime(1);
  
}, 5000);
