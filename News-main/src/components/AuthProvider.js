import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from './firebase';
import { Navigate } from 'react-router-dom';
 
const AuthContext = createContext();
 
export const useAuth = () => useContext(AuthContext);
 
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
 
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });
 
    return unsubscribe;
  }, []);
 
  // ProtectedRoute component included within the AuthProvider.js
  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      // Redirect to the login page if the user is not authenticated
      return <Navigate to="/login" />;
    }
 
    return children;
  };
 
  return (
<AuthContext.Provider value={{ currentUser, ProtectedRoute }}>
      {children}
</AuthContext.Provider>
  );
};