import { useEffect, useState } from "react";
import React from "react";
import api from "../../../api";

const WelcomeSection = () => {
    const [student, setStudent] = useState(null);

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const res = await api.get("/api/users/student-profile/")
                setStudent(res.data)
            } catch (error) {
                console.error("Error fetching student data", error);
            }
        }
        fetchStudentData();
    }, [])

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            {student 
            ? (
                <>
                    <h1 className="text-2xl font-bold text-gray-700">Welcome, {student.first_name}!</h1>
                    <p className="text-gray-600 mt-2">Email: {student.email}</p>
                    {/* Add more profile info if needed */}
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    )
}

export default WelcomeSection