import React from "react";
import Navbar from "../components/Navbarr";
import UserProfile from "../components/Profile";
import StudentDashboard from "./Dashboard";



function Home () {
    return (
        <>
            <Navbar/>
            <div className="container mt-5">
                <StudentDashboard/>
            </div>
        </>
    )
}

export default Home