import React, { createContext, useContext, useState, useEffect } from "react";

// Create the AuthContext
const AuthContext = createContext(null);

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider component to wrap your application
export const AuthProvider = ({ children }) => {
  // State to hold authentication status, user information, AND THE TOKEN
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => {
    // NEW STATE FOR TOKEN
    return localStorage.getItem("token"); // Initialize token from localStorage
  });

  // Function to handle user login
  // Now accepts both user data AND the token
  const login = (userData, authToken) => {
    setIsAuthenticated(true);
    setUser(userData);
    setToken(authToken); // Store the token
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken); // Store the token in localStorage
  };

  // Function to handle user logout
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setToken(null); // Clear the token
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // Remove token from localStorage
  };

  // Optional: Re-verify token on app load (more robust, but adds complexity)
  // useEffect(() => {
  //   if (token) {
  //     // You could send a request to a backend /verify-token endpoint here
  //     // or decode the token locally to check expiration (though not signature)
  //     // If verification fails, call logout()
  //   }
  // }, [token]); // Run once when token changes (e.g., on initial load)

  // The value provided to consumers of the context
  const value = {
    isAuthenticated,
    user,
    token, // Make the token available via context
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
