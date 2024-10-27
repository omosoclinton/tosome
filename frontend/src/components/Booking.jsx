import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../api';
import DatePicker from 'react-datepicker'; // Assuming you're using a date picker library

function BookingForm({ tutorId }) {
  const [formData, setFormData] = useState({
    date_time: '',
    subject: '',
    location: '',
  });

  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  useEffect(() => {
    const fetchAvailableTimeSlots = async () => {
      try {
        const response = await api.get(`/api/tutors/${tutorId}/available-time-slots/`);
        setAvailableTimeSlots(response.data);
      } catch (error) {
        console.error('Error fetching available time slots:', error);
      }
    };

    fetchAvailableTimeSlots();
  }, [tutorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/users/sessions/', { ...formData, tutor: tutorId });
      // Handle success, e.g., show a confirmation message
    } catch (error) {
      // Handle error, e.g., display an error message
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Date and Time:
        <DatePicker selected={formData.date_time} onChange={(date) => setFormData({ ...formData, date_time: date })} />
      </label>
      <label>
        Subject:
        <input type="text" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} />
      </label>
      <label>
        Location:
        <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
      </label>
      <button type="submit">Book Session</button>
      <div>
        <h3>Available Time Slots:</h3>
        <ul>
          {availableTimeSlots.map((slot) => (
            <li key={slot.id}>{slot.start_time} - {slot.end_time}</li>
          ))}
        </ul>
      </div>
    </form>
  );
}

export default BookingForm;