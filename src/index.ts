import dotenv from 'dotenv';
import { SocketService } from './services/socket.js';
import { EarsService } from './services/ears.js';
import { VoiceService } from './services/voice.js';

dotenv.config();

console.log('🚀 Astra Pi Client Initializing...');

const ASTRA_API_URL = process.env.ASTRA_API_URL || 'http://localhost:3000';
const ASTRA_API_SECRET = process.env.ASTRA_API_SECRET;

const nervousSystem = new SocketService(ASTRA_API_URL, ASTRA_API_SECRET);
const ears = new EarsService(nervousSystem);
const voice = new VoiceService();

// Connect the senses
nervousSystem.onSpeak((audioChunk) => {
    voice.playAudio(audioChunk);
});

// Initialize the Nervous System
nervousSystem.connect();

// Temporary: Trigger listening on 'L' key for testing (if running interactively)
process.stdin.on('data', (key) => {
    if (key.toString().trim() === 'l') {
        ears.startStreaming();
    } else if (key.toString().trim() === 's') {
        ears.stopStreaming();
    }
});


// Keep the process alive
setInterval(() => {
    // Heartbeat logic could move into the service later
}, 60000);
