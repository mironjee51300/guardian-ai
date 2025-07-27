# Guardian AI - Cross-Platform Fraud Protection

AI-powered fraud protection app with advanced threat detection for **Windows**, **Linux**, **Android**, and **rooted devices**.

## 🛡️ Features

- **Fraud Call Protection** - Block suspicious calls
- **SMS Fraud Detection** - Detect spam and phishing SMS
- **Email Security** - Phishing email detection
- **Website Protection** - Malicious website blocking
- **Mobile System Analysis** - Deep system scanning
- **Root/Jailbreak Detection** - Enhanced security for modified devices
- **Real-time Monitoring** - Live threat detection across all platforms

## 🚀 Platform Support

### ✅ Android
- Full system analysis and malware detection
- Root access detection and protection
- App permission monitoring
- Background process analysis
- Network traffic monitoring

### ✅ iOS  
- Jailbreak detection
- Certificate validation
- App sandbox analysis
- Network security monitoring

### ✅ Windows/Linux Desktop
- Process monitoring and analysis
- File system protection
- Registry monitoring (Windows)
- Network firewall integration
- Real-time system scanning

### ✅ Web/PWA
- Basic fraud protection
- Website security analysis
- Email and communication monitoring

## 📱 Quick Start

### For Mobile Development:

1. **Export to GitHub** and clone the repository:
   ```bash
   git clone <your-repo-url>
   cd guardian-ai
   npm install
   ```

2. **Android Deployment:**
   ```bash
   npx cap add android
   npx cap update android
   npm run build
   npx cap sync android
   npx cap run android
   ```

3. **iOS Deployment (macOS only):**
   ```bash
   npx cap add ios
   npx cap update ios
   npm run build
   npx cap sync ios
   npx cap run ios
   ```

### For Desktop Development:

4. **Windows/Linux (Electron):**
   ```bash
   npm install @capacitor-community/electron --save-dev
   npx cap add @capacitor-community/electron
   npm run build
   npx cap sync @capacitor-community/electron
   npx cap run @capacitor-community/electron
   ```

## Installation & Deployment

### Installer Files

Guardian AI provides ready-to-install packages for all platforms:

#### Download & Install
```bash
# Generate all installer files
./scripts/build-platforms.sh all

# Platform-specific installers
./scripts/build-platforms.sh android    # APK for Android
./scripts/build-platforms.sh ios        # IPA for iOS
./scripts/build-platforms.sh windows    # EXE for Windows
./scripts/build-platforms.sh linux      # AppImage/DEB for Linux
./scripts/build-platforms.sh macos      # DMG for macOS
```

#### Installation Instructions

**📱 Android (APK)**
```bash
# Download guardian-ai-v1.0.0.apk from release/ folder
# Enable "Unknown Sources" in Android settings
# Install APK file on device
adb install guardian-ai-v1.0.0.apk
```

**🍎 iOS (IPA)**
```bash
# Install via TestFlight or Xcode
# Requires Apple Developer account for distribution
ios-deploy --bundle guardian-ai-v1.0.0.ipa
```

**🪟 Windows (EXE)**
```bash
# Run installer as administrator
guardian-ai-windows-setup-v1.0.0.exe
# Follow installation wizard
# Creates desktop shortcut and Start Menu entry
```

**🐧 Linux (AppImage)**
```bash
# Make executable and run
chmod +x guardian-ai-linux-v1.0.0.AppImage
./guardian-ai-linux-v1.0.0.AppImage

# Or install DEB package
sudo dpkg -i guardian-ai-linux-v1.0.0.deb
```

**🍎 macOS (DMG)**
```bash
# Open DMG file
open guardian-ai-macos-v1.0.0.dmg
# Drag Guardian AI to Applications folder
# Run from Applications or Launchpad
```

### Quick Build Script
./scripts/build-platforms.sh electron
./scripts/build-platforms.sh all
```

## 🔧 Root/Jailbreak Detection

Guardian AI includes advanced detection for:

- **Android Root Detection**: Detects su, busybox, Magisk, Xposed
- **iOS Jailbreak Detection**: Identifies modified iOS systems
- **System Integrity**: Monitors for unauthorized system modifications
- **Enhanced Security**: Provides additional protection layers for modified devices

## 🛠️ Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npx cap sync         # Sync with native platforms
```

## 📋 Requirements

- **Android**: Android Studio, Android SDK
- **iOS**: macOS, Xcode
- **Desktop**: Node.js, npm
- **All Platforms**: Modern web browser support

## 🔒 Security Features by Platform

| Feature | Android | iOS | Windows | Linux | Web |
|---------|---------|-----|---------|-------|-----|
| Fraud Call Protection | ✅ | ✅ | ✅ | ✅ | ✅ |
| SMS Detection | ✅ | ✅ | ❌ | ❌ | ❌ |
| System Analysis | ✅ | ✅ | ✅ | ✅ | ⚠️ |
| Root Detection | ✅ | ✅ | ✅ | ✅ | ❌ |
| Real-time Monitoring | ✅ | ✅ | ✅ | ✅ | ⚠️ |
| Deep Malware Scan | ✅ | ⚠️ | ✅ | ✅ | ❌ |

✅ Full Support | ⚠️ Limited Support | ❌ Not Available


Built with ❤️ using React, TypeScript, Capacitor, and Tailwind CSS.


**Use your preferred IDE**: Clone this repo and push changes. Requires Node.js & npm.

```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm i
npm run dev
```

## Technologies Used

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Capacitor (for native mobile/desktop apps)