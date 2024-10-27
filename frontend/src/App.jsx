import React from "react"
//import './App.css'
import { useState, useEffect, useReducer } from "react"
import { BrowserRouter, Route, Routes, Navigate, useNavigate } from 'react-router-dom'
import Home from "./pages/Home"
import LandingPage from "./pages/LandingPage"
import Student from "./pages/Student"
import Tutor from "./pages/Tutor"
import Login from "./components/Login"
import ProtectedRoute from "./components/ProtectedRoute"
import NotFound from "./pages/NotFound"
import Register from "./components/Register"
import Dropdown from "./components/ProfileDropdown"
import { ProfileContext, TutorProfileContext, useMyContext } from "./components/Context"
import api from "../api"
import ProfilePage from "./pages/ProfilePage"
import { INITIAL_STATE } from "./reducers/tutorReducer"
import { AuthProvider } from "./context/AuthContext"
import { useAuth } from "./context/AuthContext"
import StudentDashboard from "./pages/Dashboard"
import Logout from "./components/Logout"
import RegisterAndLogOut from "./components/RegisterAndLogout"
import useProfileData from "./hooks/useProfileData"
import BookSession from "./components/Booking"



function App() {
  const {user, profile} = useProfileData()

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path='/home'
            element={
              <ProtectedRoute>
                <TutorProfileContext.Provider value={{ profile, user }}>
                  <Home />
                </TutorProfileContext.Provider>
              </ProtectedRoute>
            } />
          <Route
            path='/profile'
            element={
              <ProtectedRoute>
                <TutorProfileContext.Provider value={{ profile, user }}>
                  <ProfilePage />
                </TutorProfileContext.Provider>
              </ProtectedRoute>
            } />
          <Route
            path='/student'
            element={
              <ProtectedRoute>
                <TutorProfileContext.Provider value={{ profile, user }}>
                  <Student />
                </TutorProfileContext.Provider>
              </ProtectedRoute>
            } />
          <Route
            path='/dashboard'
            element={
              <ProtectedRoute>
                <TutorProfileContext.Provider value={{ profile, user }}>
                  <StudentDashboard />
                </TutorProfileContext.Provider>
              </ProtectedRoute>
            } />
          <Route path='/' element={<LandingPage />} />
          <Route path='/booking' element={<BookSession />} />
          <Route path='/login' element={<Login />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='/dropdown' element={<Dropdown />} />
          <Route path='/tutor' element={<Tutor />} />
          <Route path='/register' element={<RegisterAndLogOut />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App



{/*
  const initialValues = {
  first_name: '',
  last_name: '',
  subjects: '',
  qualifications: '',
  experience: '',
};

    const tutorReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TUTOR':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

    const [tutor, dispatch] = useReducer(tutorReducer, initialValues)
  
    const getTutor = async () => {
    try {
      const res = await api.get("/api/users/get-tutor/");
      dispatch({type: 'SET_TUTOR', payload: res.data})
      console.log('Tutor data:', res.data);
    } catch (error) {
      alert('Error fetching tutor profile')
      console.error(error)
    };
  };
  
  const initialValues = {
    first_name: data.first_name,
    last_name: data.last_name,
    subjects: data.subjects,
    qualifications: data.qualifications,
    experience: data.experience,
  };



  
  const getTutor1 = async () => {
    try {
      const res = await api.get("/api/users/get-tutor/");
      dispatch({
        type: 'SET_TUTOR',
        payload: res.data,
      })
      console.log('Tutor data:', res.data);
    } catch (error) {
      alert('Error fetching tutor profile')
      console.error(error)
    };
  };

  

      <Routes>
      <ProtectedRoute>
      <TutorProfileContext.Provider value={{ tutor }}>
        <Route
          path='/home'
          element={
                <Home />
          } />
        <Route
          path='/profile'
          element={
                <ProfilePage />
          } />
        <Route
          path='/tutor'
          element={
                <Tutor />
          } />
        <Route
          path='/student'
          element={
                <Student />
          } />
           </TutorProfileContext.Provider>
           </ProtectedRoute>


<Route
          path='/home'
          element={
            <ProtectedRoute>
              <TutorProfileContext.Provider value={{ tutor }}>
                <Home />
              </TutorProfileContext.Provider>
            </ProtectedRoute>
          } />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <TutorProfileContext.Provider value={{ tutor }}>
                <ProfilePage />
              </TutorProfileContext.Provider>
            </ProtectedRoute>
          } />
        <Route
          path='/tutor'
          element={
            <ProtectedRoute>
              <TutorProfileContext.Provider value={{ tutor }}>
                <Tutor />
              </TutorProfileContext.Provider>
            </ProtectedRoute>
          } />
        <Route
          path='/student'
          element={
            <ProtectedRoute>
              <TutorProfileContext.Provider value={{ tutor }}>
                <Student />
              </TutorProfileContext.Provider>
            </ProtectedRoute>
          } />



  */}