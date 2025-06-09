import React, { useEffect, useState } from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';


const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = React.createContext();

const AuthProvider = ({children}) => {

  const [token, setToken] = React.useState(localStorage.getItem('token') || null);
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  //check if user is authenticated
  const checkAuth = async () => {
    try {

      const { data } = await axios.get('/api/user/check');
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      console.error(error.message)
    }
  }


  //login function 
  const login = async (state, fullName, email, password, bio) => {
    try {
      const endpoint = state === 'login' ? '/api/user/login' : '/api/user/signup';
      const { data } = await axios.post(endpoint, {fullName,email, password, bio });
      console.log(data);

      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
        axios.defaults.headers.common['token'] = data.token;
        setToken(data.token);
        localStorage.setItem('token', data.token);
        toast.success(data.message);
      }

    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }

  //logout function
  const logout = async () => {
    localStorage.removeItem('token');
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    toast.success('Logged out successfully');
  }
  //update profile function
  const updateProfile = async (userData) => {
    try {
      const { data } = await axios.put('/api/user/update-profile', userData);
      console.log(data);
      
      if(data.success){
        setAuthUser(data.user);
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }


  //connect socket function to online users
  const connectSocket = (userData) => {
    if (!userData ||socket?.connected) return;
    const newSocket = io(backendUrl, { 
      query:{
        userId: userData._id,
      }
    });

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      setSocket(newSocket);
    });

    newSocket.on('getOnlineUsers', (users) => {
      setOnlineUsers(users);
    });
  }


  //useEffect
  useEffect(()=>{
    if(token){
      axios.defaults.headers.common['token'] = token;
      checkAuth();
    }
  },[token])

  const value = {
    axios,
    token,
    setToken,
    authUser,
    setAuthUser,
    onlineUsers,
    setOnlineUsers,
    socket,
    setSocket,
    login,
    logout,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider