import React, { createContext, useState, useContext, useEffect } from "react";

// Create the Token Context
const TokenContext = createContext();

// Token Provider Component
export const TokenProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    // Retrieve token from localStorage on initialization
    return localStorage.getItem("token") || null;
  });

  useEffect(() => {
    // Save token to localStorage whenever it changes
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  return (
    <TokenContext.Provider value={{ token, setToken }}>
      {children}
    </TokenContext.Provider>
  );
};

// Custom Hook to use the Token Context
export const useToken = () => {
  return useContext(TokenContext);
};
