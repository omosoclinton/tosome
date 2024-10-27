import React from "react";

const TutorCard = ({ name, subject, rating, location, onBook, id }) => (
    <div className="bg-white shadow-md p-4 rounded-lg mb-6">
        <h3 className="text-xl font-bold">{name}</h3>
        <p className="text-gray-600">Subject: {subject}</p>
        <p className="text-gray-600">Rating: {rating}/5</p>
        <p className="text-gray-600">Location: {location}</p>
        <button onClick={onBook} className="bg-blue-500 text-white px-4 py-2 mt-4 inline-block rounded hover:bg-blue-600">
            Book a Session
        </button>
    </div>
);

export default TutorCard