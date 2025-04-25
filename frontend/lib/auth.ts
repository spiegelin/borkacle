import api from './api';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

// Define user type
export interface User {
  id: number;
  email: string;
  nombre: string;
  rol: string;
}

// Define JWT decoded payload type
interface JwtPayload {
  sub: string; // username/email
  exp: number;
  iat: number;
}

// Set a cookie with the token
const setAuthCookie = (token: string) => {
  // Set cookie to expire in 1 day (or match your JWT expiration)
  Cookies.set('authToken', token, { expires: 1, path: '/', sameSite: 'Lax' });
};

// Remove the auth cookie
const removeAuthCookie = () => {
  Cookies.remove('authToken', { path: '/' });
};

// Get token from cookie
const getAuthToken = (): string | null => {
  return Cookies.get('authToken') || null;
};

// Login function
export const login = async (email: string, password: string): Promise<User> => {
  try {
    const response = await api.post('/api/auth/login', { email, password });
    const { token, id, email: userEmail, nombre, rol } = response.data;
    
    // Store token in cookie
    setAuthCookie(token);
    
    // Store user info
    const user: User = { id, email: userEmail, nombre, rol };
    localStorage.setItem('user', JSON.stringify(user));
    
    return user;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// Sign up function
export const signup = async (userData: {
  nombre: string;
  email: string;
  password: string;
  rol?: string;
}): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.post('/api/auth/signup', userData);
    return { success: true, message: response.data.message };
  } catch (error: any) {
    console.error('Signup failed:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Registration failed. Please try again.' 
    };
  }
};

// Logout function
export const logout = (): void => {
  removeAuthCookie();
  localStorage.removeItem('user');
  // Redirect handled by the component
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  const token = getAuthToken();
  if (!token) {
    return false;
  }
  
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;
    
    // Check if token is expired
    if (decoded.exp < currentTime) {
      // Token expired, clean up
      logout();
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Invalid token:', error);
    logout();
    return false;
  }
};

// Get current user
export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  if (!isAuthenticated()) {
    return null;
  }
  
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    return null;
  }
  
  try {
    return JSON.parse(userStr) as User;
  } catch (error) {
    console.error('Failed to parse user data:', error);
    return null;
  }
}; 