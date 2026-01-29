import record from 'node-record-lpcm16';
import { SocketService } from './socket.js';
import fs from 'fs';

export class EarsService {
    private recording: any;
    private socket: SocketService;
    private isListening: boolean = false;

    constructor(socket: SocketService) {
        this.socket = socket;
    }

    /**
     * Start streaming raw audio to the Brain (Cloud).
     * Used when Wake Word is detected or "Listen" command received.
     */
    public startStreaming(): void {
        if (this.isListening) return;

        console.log('👂 Ears: Started listening...');
        this.isListening = true;

        // Notify Brain we are starting
        this.socket.emit('astra:ears:start', { timestamp: Date.now() });

        try {
            this.recording = record.record({
                sampleRate: 16000,
                threshold: 0, // catch all
                verbose: false,
                recordProgram: 'rec', // Try 'rec' (sox) or 'arecord' (alsa)
                silence: '10.0',
            });

            const stream = this.recording.stream();

            stream.on('data', (chunk: Buffer) => {
                if (this.isListening) {
                    // Send raw binary audio chunk
                    this.socket.emit('astra:ears:audio_chunk', chunk);
                }
            });

            stream.on('error', (err: any) => {
                console.error('⚠️ Ears Error:', err);
            });

        } catch (error) {
            console.error("❌ Failed to start recording:", error);
        }
    }

    public stopStreaming(): void {
        if (!this.isListening) return;

        console.log('🔇 Ears: Stopped listening.');
        this.isListening = false;

        if (this.recording) {
            this.recording.stop();
        }

        this.socket.emit('astra:ears:stop', { timestamp: Date.now() });
    }
}
