const fs = require('fs');
const csv = require('csv-parser');

function parseDateTime(date, time) {
  if (!date || !time) return null;

  // Handles DD-MM-YYYY or D-M-YYYY or with /
  const [d, m, y] = date.split(/[-/]/);

  const day = d.padStart(2, '0');
  const month = m.padStart(2, '0');

  // Returns a valid ISO datetime string
  return new Date(`${y}-${month}-${day}T${time}`);
}

function readCSV(path) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(path)
      .pipe(csv())
      .on('data', (row) => {
        const timestamp = parseDateTime(row.Date, row.Time);
        results.push({
          timestamp,
          city: row.City,
          department: row['Product line'],
        });
      })
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
}

module.exports = readCSV;
