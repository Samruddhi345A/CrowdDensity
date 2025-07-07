const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');

const router = express.Router();


router.get('/summary/departments', (req, res) => {
  const results = [];

  fs.createReadStream('./data/your-data.csv')
    .pipe(csv())
    .on('data', (row) => results.push(row))
    .on('end', () => {
      const summary = {};

      results.forEach(row => {
        const dept = row['Product line'];
        if (!summary[dept]) summary[dept] = 0;
        summary[dept]++;
      });

      // Convert to array format
      const data = Object.entries(summary).map(([department, count]) => ({
        department,
        count
      }));

      res.json(data);
    });
});

function to24HourTime(timeStr) {
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes, seconds] = time.split(':');

  hours = parseInt(hours);

  if (modifier === 'PM' && hours !== 12) {
    hours += 12;
  }
  if (modifier === 'AM' && hours === 12) {
    hours = 0;
  }

  return `${hours.toString().padStart(2, '0')}:${minutes}:${seconds}`;
}


router.get('/summary/best-time', (req, res) => {
  const results = [];
  const csv = require('csv-parser');

  fs.createReadStream('./data/your-data.csv')
    .pipe(csv())
    .on('data', (row) => results.push(row))
    .on('end', () => {
      const hourCounts = {};

      results.forEach(row => {
        const dateStr = row['Date']?.trim();
        const timeStr = row['Time']?.trim();

        if (!dateStr || !timeStr) return;

        // Robust parsing
        const [m, d, y] = dateStr.split(/[-/]/);

        const day = d.padStart(2, '0');

        const month = m.padStart(2, '0');

        const time24 = to24HourTime(timeStr);


        const datetime = new Date(`${y}-${month}-${day}T${time24}`);
        if (isNaN(datetime)) return;

        const hour = datetime.getHours(); // 0 to 23

        if (!hourCounts[hour]) hourCounts[hour] = 0;
        hourCounts[hour]++;
      });

      // Convert to array and sort by least crowd
      const result = Object.entries(hourCounts).map(([hour, count]) => ({
        hour: `${hour}:00`,
        count: count
      })).sort((a, b) => a.count - b.count); // least busy first

      res.json(result);
    });
});


module.exports = router;
