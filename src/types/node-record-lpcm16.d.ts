declare module 'node-record-lpcm16' {
    import { Readable } from 'stream';

    interface RecordOptions {
        sampleRate?: number;
        channels?: number;
        compress?: boolean;
        threshold?: number;
        thresholdStart?: number;
        thresholdEnd?: number;
        silence?: string;
        verbose?: boolean;
        recordProgram?: string;
        device?: string;
    }

    interface Recording {
        stream(): Readable;
        stop(): void;
        pause(): void;
        resume(): void;
        isPaused(): boolean;
    }

    export function record(options?: RecordOptions): Recording;
}
