import React from "react";
import WelcomeSection from "../components/dashboard/WelcomeSection";
import TutorSearch from "../components/dashboard/SearchTutors";

const StudentDashboard = () => {
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <WelcomeSection/>
            <TutorSearch />
        </div>
    )
}

export default StudentDashboard