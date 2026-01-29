declare module 'node-webcam' {
    interface WebcamOptions {
        width?: number;
        height?: number;
        quality?: number;
        delay?: number;
        saveShots?: boolean;
        output?: string;
        device?: string | boolean;
        callbackReturn?: string;
        verbose?: boolean;
    }

    interface Webcam {
        capture(filename: string, callback: (err: any, data: any) => void): void;
        list(callback: (list: any[]) => void): void;
    }

    export function create(options: WebcamOptions): Webcam;
    export function capture(filename: string, options: WebcamOptions, callback: (err: any, data: any) => void): void;
}
