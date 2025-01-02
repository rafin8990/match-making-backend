import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './config/index';
import { socket_server } from './socket/socket.server';

process.on('uncaughtException', error => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

let server: Server;
export let io: any;

async function boostrap() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log(`🛢 Database is connected successfully`);
    server = app.listen(config.port, () => {
      console.log(`🚀 Application is listening on port ${config.port}`);
    });

    io = require('socket.io')(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    socket_server();
  } catch (err) {
    console.error('Failed to connect to the database:', err);
    process.exit(1); 
  }
}

process.on('unhandledRejection', error => {
  console.error('Unhandled Rejection:', error);
  if (server) {
    server.close(() => {
      console.error('Server closed due to unhandled rejection');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  if (server) {
    server.close(() => {
      console.log('Server closed');
    });
  }
});

boostrap();
