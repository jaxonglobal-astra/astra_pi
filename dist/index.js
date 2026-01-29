import dotenv from 'dotenv';
import { SocketService } from './services/socket.js';
dotenv.config();
console.log('🚀 Astra Pi Client Initializing...');
const ASTRA_API_URL = process.env.ASTRA_API_URL || 'http://localhost:3000';
const ASTRA_API_SECRET = process.env.ASTRA_API_SECRET;
const nervousSystem = new SocketService(ASTRA_API_URL, ASTRA_API_SECRET);
// Initialize the Nervous System
nervousSystem.connect();
// Keep the process alive
setInterval(() => {
    // Heartbeat logic could move into the service later
}, 60000);
