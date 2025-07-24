import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.d2a18346055e48d2848b716cc355d450',
  appName: 'guardian-ai',
  webDir: 'dist',
  server: {
    url: 'https://d2a18346-055e-48d2-848b-716cc355d450.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#0f1419",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      spinnerColor: "#ffffff"
    },
    Device: {
      // Enable device information access for system analysis
    },
    App: {
      // Enable app state monitoring for security analysis
    },
    Network: {
      // Monitor network connections for security threats
    }
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false
  },
  electron: {
    // Desktop (Windows/Linux) configuration
    trayIconAndMenuEnabled: false,
    splashScreenEnabled: true,
    splashScreenImageName: 'splash.png'
  }
};

export default config;