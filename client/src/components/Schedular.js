import React, { useEffect, useState } from 'react';
import axios from 'axios'


const Scheduler = () => {
  const [slots, setSlots] = useState([]);
  const [selected, setSelected] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/schedule/slots')
      .then(res => setSlots(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleBooking = () => {
    if (!selected) return;

    axios.post('http://localhost:5000/api/schedule/book', { userId: 'demo-user-001',hour: selected })
      .then(() => setSuccess(true))
      .catch(() => setSuccess(false));
  };

  const getColor = (crowd) => {
    if (crowd < 25) return '#d1fae5'; // green
    if (crowd < 100) return '#fef3c7'; // yellow
    return '#fee2e2'; // red
  };

  return (
    <div>
      <h2>📅 Smart Visit Scheduler</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px' }}>
        {slots.map((slot, idx) => (
          <div
            key={idx}
            onClick={() => setSelected(slot.hour)}
            style={{
              padding: '10px',
              borderRadius: '10px',
              border: selected === slot.hour ? '3px solid #3b82f6' : '1px solid #ccc',
              backgroundColor: getColor(slot.crowd),
              cursor: 'pointer',
              textAlign: 'center'
            }}
          >
            <strong>{slot.hour}</strong><br />
            {slot.crowd} visitors
          </div>
        ))}
      </div>

      {selected && (
        <div style={{ marginTop: '20px' }}>
          <p>Selected slot: <strong>{selected}</strong></p>
          <button onClick={handleBooking} style={{ padding: '8px 16px' }}>
            Confirm Booking
          </button>
        </div>
      )}

      {success && selected && (
        <div style={{ marginTop: '15px', background: '#d1fae5', padding: '10px', borderRadius: '6px' }}>
          ✅ Booking confirmed for <strong>{selected}</strong>!

          {slots.find(s => s.hour === selected)?.crowd < 25 && (
            <div>🎉 Bonus: Fast Checkout Coupon Unlocked!</div>
          )}
        </div>
      )}

      {success === false && (
        <div style={{ marginTop: '15px', background: '#fee2e2', padding: '10px', borderRadius: '6px' }}>
          ❌ Something went wrong. Try again.
        </div>
      )}
    </div>
  );
};

export default Scheduler;
