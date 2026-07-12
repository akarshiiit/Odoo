import React, { createContext, useContext, useState, useEffect, useCallback } from "react";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TOKEN_KEY = "transitops_token";
const USER_KEY = "transitops_user";


const AuthContext = createContext(undefined);


const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  
  const persistAuth = (token, userData) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));

    setUser(userData);
    setRole(userData?.role ?? null);
    setIsAuthenticated(true);
  };

  
  const clearAuth = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
  };

  
  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Login failed. Please try again.");
      }

      const { token, user: userData } = data;

      persistAuth(token, userData);

      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

 
  const signup = useCallback(async (signupData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Signup failed. Please try again.");
      }

      const { token, user: userData } = data;

     
      persistAuth(token, userData);

      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  
  const checkAuth = useCallback(() => {
    setLoading(true);

    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (!token || !storedUser) {
        clearAuth();
        return;
      }

      const parsedUser = JSON.parse(storedUser);

     
      if (!parsedUser || typeof parsedUser !== "object") {
        throw new Error("Invalid stored user data.");
      }

      setUser(parsedUser);
      setRole(parsedUser?.role ?? null);
      setIsAuthenticated(true);
    } catch (err) {
     
      clearAuth();
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
  checkAuth();
}, [checkAuth]);

  
  const logout = useCallback(() => {
    clearAuth();
  }, []);

  const value = {
    user,
    role,
    loading,
    error,
    isAuthenticated,
    login,
    signup,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export { AuthContext, AuthProvider, useAuth };
