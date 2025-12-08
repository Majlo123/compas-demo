import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import config from 'config/config';
import logger from 'config/logger';
import { authService } from 'services';

let io: SocketIOServer | null = null;

export const initializeSocket = (httpServer: HTTPServer): SocketIOServer => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: `${config.corsAllowed}`.split(','),
      credentials: true,
    },
  });

  // Authentication middleware for socket connections
  io.use((socket: Socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      logger.info(`Socket auth attempt - Token present: ${!!token}`);

      if (!token) {
        logger.error(new Error('Socket authentication error: No token provided'));
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = authService.verifyToken(token);
      logger.info(`Socket auth successful for user: ${decoded.sub}`);

      // Attach user info to socket
      socket.data.user = {
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role,
      };

      next();
    } catch (error) {
      logger.error(error instanceof Error ? error : new Error(`Socket authentication error: ${String(error)}`));
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const userId = socket.data.user?.id;
    logger.info(`Socket connected: ${socket.id}, User: ${userId}`);

    // Join user to their personal room for targeted notifications
    if (userId) {
      socket.join(`user:${userId}`);
      logger.info(`User ${userId} joined room: user:${userId}`);
    }

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}, User: ${userId}`);
    });
  });

  logger.info('Socket.IO server initialized');
  return io;
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error('Socket.IO not initialized. Call initializeSocket first.');
  }
  return io;
};

export const emitToUser = (userId: string, event: string, data: any): void => {
  if (!io) {
    logger.warn('Socket.IO not initialized, cannot emit event');
    return;
  }

  logger.info(`Emitting event '${event}' to user ${userId}`);
  const room = `user:${userId}`;
  const sockets = io.sockets.adapter.rooms.get(room);
  logger.info(`Sockets in room '${room}': ${sockets?.size || 0}`);
  
  io.to(room).emit(event, data);
  logger.info(`Emitted ${event} to user ${userId}`);
};
