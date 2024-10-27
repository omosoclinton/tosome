import { useEffect, useState } from "react";
import api from "../../../api";

const TutorSearch = () => {
    const [tutors, setTutors] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();  // Prevent default form submission
        setLoading(true);  // Set loading state to true
        try {
            const res = await api.get(`/api/users/search/?subject=${searchTerm}`);
            console.log(res.data)
            setTutors(res.data);
        } catch (error) {
            console.error("Error searching tutors", error);
            setTutors([]);  // Reset tutors if there is an error
        } finally {
            setLoading(false);  // Set loading state to false
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Find a Tutor</h3>
            <form onSubmit={handleSearch} className="flex items-center space-x-4">
                <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                    placeholder="Search by subject or qualifications"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                >
                    {loading ? "Searching..." : "Search"}
                </button>
            </form>

            <div className="mt-6">
                {loading ? (
                    <p className="text-gray-600 mt-4">Searching for tutors...</p>
                ) : (
                    <>
                        {tutors.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {tutors.map((tutor) => (
                                    <div key={tutor.id} className="bg-gray-50 p-4 rounded-lg shadow">
                                        <h4 className="text-lg font-bold text-gray-700">{tutor.user.first_name}</h4>
                                        <p className="text-gray-600">{tutor.subjects}</p>
                                        <p className="text-gray-500">{tutor.qualifications}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 mt-4">No results found. Try searching for a different subject or qualification.</p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default TutorSearch;
