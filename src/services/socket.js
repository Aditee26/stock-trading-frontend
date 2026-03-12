import { io } from 'socket.io-client';

let socket;

export const initializeSocket = (token) => {
  socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
    auth: {
      token
    }
  });

  socket.on('connect', () => {
    console.log('Connected to socket server');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from socket server');
  });

  socket.on('stockUpdate', (data) => {
    console.log('Stock update received:', data);
    // You can dispatch this to Redux store
  });

  socket.on('notification', (data) => {
    console.log('Notification received:', data);
    // You can show toast notifications here
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};