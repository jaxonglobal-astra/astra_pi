import dotenv from 'dotenv';
import { io } from 'socket.io-client';
dotenv.config();
console.log('🚀 Astra Pi Client Initializing...');
const ASTRA_API_URL = process.env.ASTRA_API_URL || 'http://localhost:3000';
console.log(`Connecting to Astra Core at: ${ASTRA_API_URL}`);
// Placeholder for socket connection
const socket = io(ASTRA_API_URL, {
    autoConnect: false,
    reconnection: true,
});
socket.on('connect', () => {
    console.log('✅ Connected to Astra Core');
});
socket.on('disconnect', () => {
    console.log('❌ Disconnected from Astra Core');
});
socket.on('connect_error', (err) => {
    console.error('⚠️ Connection error:', err.message);
});
// For now, just keep the process alive
setInterval(() => {
    // Heartbeat or status check could go here
    console.log('💓 Astra Pi Heartbeat');
}, 30000);
// socket.connect(); // Uncomment when ready to actually connect
