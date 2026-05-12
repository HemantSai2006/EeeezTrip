import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data from storage on mount
  useEffect(() => {
    const savedUsers = localStorage.getItem('eeeztrip_users');
    const savedAuth = sessionStorage.getItem('eeeztrip_auth');
    
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
    
    if (savedAuth) {
      const user = JSON.parse(savedAuth);
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
    
    setLoading(false);
  }, []);

  // Save users to localStorage when they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('eeeztrip_users', JSON.stringify(users));
    }
  }, [users, loading]);

  // Save auth state to sessionStorage
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      sessionStorage.setItem('eeeztrip_auth', JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem('eeeztrip_auth');
    }
  }, [isAuthenticated, currentUser]);

  const register = (email, password, fullName) => {
    // Check if user already exists
    if (users.some(u => u.email === email)) {
      return { success: false, message: 'Email already registered' };
    }

    // Validate password strength
    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters' };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, message: 'Invalid email format' };
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      password, // In production, this should be hashed
      fullName,
      createdAt: new Date().toISOString(),
    };

    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setIsAuthenticated(true);

    return { success: true, message: 'Registration successful!' };
  };

  const login = (email, password) => {
    // Find user
    const user = users.find(u => u.email === email);

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    // Check password
    if (user.password !== password) {
      return { success: false, message: 'Invalid password' };
    }

    setCurrentUser(user);
    setIsAuthenticated(true);

    return { success: true, message: 'Login successful!' };
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem('eeeztrip_auth');
    sessionStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      currentUser,
      users,
      loading,
      register,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
