import React, { useState, useEffect } from 'react';
import TutorCard from './TutorCard';
import api from '../../api';
import Student from '../pages/Student';
import { TutorProfileContext } from './Context';
import { useContext } from 'react';

const FindTutor = () => {
    const { user } = useContext(TutorProfileContext);
    const [tutors, setTutors] = useState([]);
    const [subjects, setSubjects] = useState([])
    const [filters, setFilters] = useState({
        subjects: '',
        location: '',
        rating: '',
    });

    console.log(user.id)

    useEffect(() => {
        fetchTutors();
    }, [filters]); // Re-fetch data when filters change

    const fetchTutors = async () => {
        try {
            const res = await api.get('/api/users/tutors/', { params: filters });
            setTutors(res.data);
            console.log(res.data)

            const allSubjects = res.data
                .map(tutor => tutor.subjects.split(','))
                .flat()
                .map(subject => subject.trim());
            setSubjects([...new Set(allSubjects)]);
        } catch (error) {
            console.error('Error fetching tutor data:', error);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
    };

    const handleBookSession = async (tutorId, subject) => {
        try {
            console.log(tutorId)
            const res = await api.post('/api/users/sessions/book/', {
                tutor: tutorId,
                subject: subject,
                date: new Date().toDateString(),
                status: 'Pending'
            })
            if (res.status === 201) {
                setTutors(tutors.filter(tutor => tutor.id !== tutorId));
            }
        } catch (error){
            console.error('Error booking session', error)
        }
    }

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 mt-5" style={{ margin: "5px" }}>
            {/* Search Bar and Filters */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">Find a Tutor</h1>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <select name="subject" value={filters.subjects} onChange={handleFilterChange} className="border p-2 rounded">
                        <option value="">Subject</option>
                        {tutors.map((tutor) => (
                            tutor.subjects.split(',').map((subject, index) => (
                                <option key={index} value={subject.trim()}>{subject.trim()}</option>
                            ))
                        ))}
                        {/* Add more subjects */}
                    </select>
                    <select name="location" value={filters.location} onChange={handleFilterChange} className="border p-2 rounded">
                        <option value="">Location</option>
                        <option value="Online">Online</option>
                        <option value="In-Person">In-Person</option>
                    </select>
                    <select name="rating" value={filters.rating} onChange={handleFilterChange} className="border p-2 rounded">
                        <option value="">Rating</option>
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                    </select>
                </div>
            </div>

            {/* Tutor Cards */}
            <div>
                {tutors.length > 0 ? (
                    tutors.map((tutor) => (
                        <TutorCard
                            key={tutor.id}
                            name={tutor.user.first_name}
                            subject={tutor.subjects}
                            rating={tutor.rating}
                            location={tutor.location}
                            onBook={() => handleBookSession(tutor.id, tutor.subjects)} // Pass the booking function to the TutorCard
                        />
                    ))
                ) : (
                    <p>No tutors found for the selected filters.</p>
                )}
            </div>
        </div>
    );
};

export default FindTutor;


