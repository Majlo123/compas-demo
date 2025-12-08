import { io, Socket } from 'socket.io-client';
import { getFromLocalStorage } from '@/services/local.storage';

let socket: Socket | null = null;

export const initializeSocket = (): Socket => {
  if (socket?.connected) {
    console.log('Socket already connected');
    return socket;
  }

  const token = getFromLocalStorage('token');
  console.log('Token from localStorage:', token ? 'Present' : 'Missing');
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  // For socket connection, we need to connect to the backend directly, not through proxy
  // In dev, connect to localhost:3000
  const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:3000' : window.location.origin;

  console.log('Socket initializing with baseUrl:', baseUrl);
  console.log('Current hostname:', window.location.hostname);
  console.log('Window origin:', window.location.origin);

  socket = io(baseUrl, {
    auth: {
      token,
    },
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('Socket connected:', socket?.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error.message);
    console.error('Full error:', error);
  });

  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const onNotification = (callback: (notification: any) => void): void => {
  if (!socket) {
    console.warn('Socket not initialized, attempting to initialize...');
    try {
      initializeSocket();
    } catch (error) {
      console.error('Failed to initialize socket in onNotification:', error);
      return;
    }
  }

  console.log('Registering notification listener');
  socket.on('notification:new', callback);
};

export const offNotification = (callback?: (notification: any) => void): void => {
  if (!socket) {
    return;
  }

  if (callback) {
    socket.off('notification:new', callback);
  } else {
    socket.off('notification:new');
  }
};

export const onNotificationUpdate = (callback: (notification: any) => void): void => {
  if (!socket) {
    console.warn('Socket not initialized, attempting to initialize...');
    try {
      initializeSocket();
    } catch (error) {
      console.error('Failed to initialize socket in onNotificationUpdate:', error);
      return;
    }
  }

  console.log('Registering notification update listener');
  socket.on('notification:updated', callback);
};

export const offNotificationUpdate = (callback?: (notification: any) => void): void => {
  if (!socket) {
    return;
  }

  if (callback) {
    socket.off('notification:updated', callback);
  } else {
    socket.off('notification:updated');
  }
};

export const onNotificationDelete = (callback: (data: { id: string }) => void): void => {
  if (!socket) {
    console.warn('Socket not initialized, attempting to initialize...');
    try {
      initializeSocket();
    } catch (error) {
      console.error('Failed to initialize socket in onNotificationDelete:', error);
      return;
    }
  }

  console.log('Registering notification delete listener');
  socket.on('notification:deleted', callback);
};

export const offNotificationDelete = (callback?: (data: { id: string }) => void): void => {
  if (!socket) {
    return;
  }

  if (callback) {
    socket.off('notification:deleted', callback);
  } else {
    socket.off('notification:deleted');
  }
};
