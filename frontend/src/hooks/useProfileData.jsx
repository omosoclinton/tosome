import { useState, useEffect } from "react";
import { INITIAL_STATE, INITIAL_USER_STATE } from "../reducers/tutorReducer";
import api from "../../api";


const useProfileData = () => {
  const [user, setUser] = useState(INITIAL_USER_STATE);
  const [profile, setProfile] = useState(INITIAL_STATE);

  useEffect(() => {
    getUser();
    console.log(user)
    getTutorProfile();
    console.log(profile)
  }, []);

  const getUser = async () => {
    try {
      const res = await api.get("/api/users/get-user/");
      console.log(res.data)
      setUser(res.data);
    } catch (error) {
      console.error("Error fetching user data", error);
    }
  };

  const getTutorProfile = async () => {
    try {
      const res = await api.get("/api/users/get-tutor-profile/");
      if (res.status === 200) {
        console.log(res.data)
        setProfile(res.data);
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error("Error fetching profile data", error);
    }
  };

  return { user, profile, setProfile };
};

export default useProfileData;
