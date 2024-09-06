import React, { useEffect, useState } from "react";
import "./bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ForgotPassword from "./components/ForgotPassword";
import { NavBar } from "./components/navbar";
import Login from "./components/login";
import SignUp from "./components/register";
import MainPage from "./components/MainPage";
import EditProfile from "./components/EditProfile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Profile from "./components/profile";
import { AuthProvider, useAuth } from "./components/AuthProvider";  // Import useAuth
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import Home from "./components/Home";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const { ProtectedRoute } = useAuth();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <AuthProvider>
      <Router>
        <div className={`App ${darkMode ? 'dark-mode' : ''}`} style={{ minHeight: '100vh', position: 'relative' }}>
          <div className="auth-wrapper">
            <div className="auth-inner">
              <Routes>
                <Route path="/" element={<Navigate to="/MainPage" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<SignUp />} />
                <Route path="/ForgotPassword" element={<ForgotPassword />} />
                <Route path="/MainPage" element={<MainPage/>}/>
                <Route path="/Home" element={<Home/>}/>
                {/* Protected Routes */}
                
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/editprofile" element={
                  <ProtectedRoute>
                    <EditProfile />
                  </ProtectedRoute>
                } />
                
              </Routes>
              <ToastContainer />
            </div>
          </div>
          <div 
            style={{ 
              position: 'absolute', 
              bottom: '20px', 
              right: '20px', 
              display: 'flex', 
              alignItems: 'center', 
              backgroundColor: darkMode ? '#333' : '#fff', 
              color: darkMode ? '#fff' : '#000', 
              padding: '10px', 
              borderRadius: '5px', 
              zIndex: 1000 
            }}
          >
            <FontAwesomeIcon 
              icon={darkMode ? faSun : faMoon} 
              style={{ marginRight: '10px', color: darkMode ? '#fff' : '#000' }} 
            />
            <label className="switch">
              <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
