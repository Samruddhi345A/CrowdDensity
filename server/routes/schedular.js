const express = require('express');
const router = express.Router();
const fs = require('fs');
const csv = require('csv-parser');

let bookings = []; // temp in-memory booking storage

router.post('/book', (req, res) => {
  console.log("Received booking:", req.body); // helpful debug log

  const { userId, hour } = req.body;

  // Validate
  if (!userId || hour == null) {
    return res.status(400).json({ error: "Missing userId or hour" });
  }

  // Save booking
  bookings.push({
    userId,
    hour,
    timestamp: new Date().toISOString()
  });

  console.log("All bookings:", bookings);

  res.json({
    message: "Booking successful",
    booking: { userId, hour }
  });
});

router.get('/all', (req, res) => {
  res.json(bookings); // optional route to fetch all bookings
});

// GET available slots with footfall data
router.get('/slots', (req, res) => {
  const results = [];
  fs.createReadStream('./data/your-data.csv')
    .pipe(csv())
    .on('data', (row) => results.push(row))
    .on('end', () => {
      const hourCounts = {};

      results.forEach(row => {
        const [m, d, y] = row.Date?.trim().split(/[-/]/);
        const time24 = to24HourTime(row.Time?.trim());

        const datetime = new Date(`${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}T${time24}`);
        const hour = datetime.getHours();

        if (!hourCounts[hour]) hourCounts[hour] = 0;
        hourCounts[hour]++;
      });

      const slots = Array.from({ length: 12 }, (_, i) => {
        const hour = i + 9; // 9 AM to 8 PM
        return {
          hour: `${hour}:00`,
          crowd: hourCounts[hour] || 0
        };
      });

      res.json(slots);
    });
});

// Simple utility
function to24HourTime(timeStr) {
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes, seconds] = time.split(':');
  hours = parseInt(hours);
  if (modifier === 'PM' && hours !== 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;
  return `${hours.toString().padStart(2, '0')}:${minutes}:${seconds}`;
}

module.exports = router;
