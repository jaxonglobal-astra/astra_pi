import NodeWebcam from 'node-webcam';
import { SocketService } from './socket.js';
import fs from 'fs';

export class EyesService {
    private socket: SocketService;
    private webcam: any;

    constructor(socket: SocketService) {
        this.socket = socket;

        // Configure based on OS (Mac vs Pi/Linux)
        const opts = {
            width: 1280,
            height: 720,
            quality: 100,
            delay: 0,
            saveShots: false,
            output: "jpeg",
            device: false, // false = default device
            callbackReturn: "base64", // Get image validation as base64 string
            verbose: false
        };

        this.webcam = NodeWebcam.create(opts);
    }

    public async takeSnapshot(): Promise<void> {
        console.log('👁️ Eyes: Taking snapshot...');

        try {
            this.webcam.capture("astra_vision_tmp", (err: any, data: any) => {
                if (err) {
                    console.error('❌ Vision Error:', err);
                    return;
                }

                // data is base64 string (because callbackReturn: "base64") OR filename depending on opts.
                // Note: node-webcam behavior varies slightly by platform/driver. 
                // Using 'base64' return is safest for immediate transmission.

                // If 'data' is the base64 string:
                let base64Image = data;

                // If data is a filename (fallback), read it:
                if (typeof data === 'string' && !data.startsWith('data:image')) {
                    // Check if it's a file path
                    if (fs.existsSync(data)) {
                        const bitmap = fs.readFileSync(data);
                        base64Image = Buffer.from(bitmap).toString('base64');
                        // cleanup
                        try { fs.unlinkSync(data); } catch (e) { }
                    }
                }

                // Remove prefix if present, we just want raw base64 or a buffer
                const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");

                console.log(`👁️ Eyes: Snapshot taken. Sending to Brain...`);
                this.socket.emit('astra:eyes:snapshot', {
                    image: cleanBase64,
                    timestamp: Date.now()
                });
            });
        } catch (error) {
            console.error('❌ Failed to capture image:', error);
        }
    }
}
