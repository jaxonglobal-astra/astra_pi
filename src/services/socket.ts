import { io, Socket } from 'socket.io-client';

export class SocketService {
    private socket: Socket | null = null;
    private url: string;
    private token: string | undefined;

    constructor(apiUrl: string, authToken?: string) {
        this.url = apiUrl;
        this.token = authToken;
    }

    public connect(): void {
        if (this.socket?.connected) {
            console.log('⚠️ Socket already connected.');
            return;
        }

        console.log(`🔌 Connecting to Astra Brain at: ${this.url}`);

        this.socket = io(this.url, {
            auth: {
                token: this.token,
            },
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
        });

        this.registerEvents();
    }

    public disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    public emit(event: string, data: any): void {
        if (!this.socket?.connected) {
            console.warn('⚠️ Cannot emit event, socket disconnected:', event);
            return;
        }
        this.socket.emit(event, data);
    }

    private registerEvents(): void {
        if (!this.socket) return;

        this.socket.on('connect', () => {
            console.log(`✅ Connected to Astra Brain (ID: ${this.socket?.id})`);
            this.emit('astra:pi:handshake', {
                deviceId: process.env.DEVICE_ID || 'unknown_pi',
                timestamp: new Date().toISOString()
            });
        });

        this.socket.on('disconnect', (reason) => {
            console.log(`❌ Disconnected from Astra Brain: ${reason}`);
        });

        this.socket.on('connect_error', (err) => {
            console.error(`⚠️ Connection Error: ${err.message}`);
        });

        // --- Core Action Listeners ---

        this.socket.on('astra:command:speak', (data: { text: string, audio?: Buffer }) => {
            console.log(`🔊 Command Received: SPEAK -> "${data.text}"`);
            if (this.speakCallback && data.audio) {
                // If the server sent the audio buffer directly (e.g. from ElevenLabs)
                this.speakCallback(data.audio);
            }
        });

        // Also listen for raw audio chunks (streaming TTS)
        this.socket.on('astra:voice:chunk', (chunk: Buffer) => {
            if (this.speakCallback) {
                this.speakCallback(chunk);
            }
        });

        this.socket.on('astra:command:move', (data: { action: string }) => {
            console.log(`🤖 Command Received: MOVE -> ${data.action}`);
            // TODO: Hand off to Motor Service
        });
    }

    private speakCallback: ((audio: Buffer) => void) | null = null;

    public onSpeak(callback: (audio: Buffer) => void): void {
        this.speakCallback = callback;
    }
}
}
