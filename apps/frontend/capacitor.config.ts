import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.bettercap.app',
    appName: 'Bettercap App',
    webDir: '../../dist/apps/frontend/browser',
    server: {
        // ! Don't do this in production!
        // hostname: '192.168.1.200:3100',
        // cleartext: true,
    }
};

export default config;
