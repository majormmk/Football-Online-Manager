import axios from './axiosConfig';

const AUTH_URL = "/auth";

export const authenticateUser = async (email, password) => {
  try {
    console.log('Attempting authentication for:', email);
    
    const response = await axios.post(AUTH_URL, {
      email,
      password
    });
    
    console.log('Auth response:', response.data);

    if (!response.data.token) {
      throw new Error('No token received from server');
    }

    return response.data;
  } catch (error) {
    console.error('Authentication error:', error.response?.data || error.message);
    throw error;
  }
};