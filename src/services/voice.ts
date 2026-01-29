import player from 'play-sound';
import fs from 'fs';
import path from 'path';
import os from 'os';

const audioPlayer = player({});

export class VoiceService {
    private isPlaying: boolean = false;
    private tempDir: string;

    constructor() {
        this.tempDir = path.join(os.tmpdir(), 'astra_voice');
        if (!fs.existsSync(this.tempDir)) {
            fs.mkdirSync(this.tempDir, { recursive: true });
        }
    }

    /**
     * Play raw audio buffer received from the Brain.
     */
    public async playAudio(audioBuffer: Buffer): Promise<void> {
        if (this.isPlaying) {
            console.log('⚠️ Voice: Already playing, queuing not implemented yet.');
            // TODO: Implement a queue
        }

        this.isPlaying = true;
        const tempFile = path.join(this.tempDir, `msg_${Date.now()}.mp3`);

        try {
            // Write buffer to temp file
            fs.writeFileSync(tempFile, audioBuffer);
            console.log(`🔊 Voice: Playing audio (${audioBuffer.length} bytes)...`);

            // Play the file
            audioPlayer.play(tempFile, (err: any) => {
                if (err) {
                    console.error('❌ Voice Error:', err);
                }
                this.isPlaying = false;
                // Cleanup
                try { fs.unlinkSync(tempFile); } catch (e) { }
            });

        } catch (error) {
            console.error('❌ Voice: Failed to write/play audio', error);
            this.isPlaying = false;
        }
    }

    public stop(): void {
        // play-sound doesn't easily support stop() without killing the process
        console.log('🔇 Voice: Stop requested (not fully implemented due to lib limitations)');
        this.isPlaying = false;
    }
}
