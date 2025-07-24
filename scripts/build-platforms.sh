#!/bin/bash

# Guardian AI Multi-Platform Build Script
# Supports Windows, Linux, Android, and iOS deployment

echo "🛡️  Guardian AI Multi-Platform Builder"
echo "======================================"

# Build web assets
echo "📦 Building web assets..."
npm run build

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Android Build
build_android() {
    echo "🤖 Building for Android..."
    if command_exists "android"; then
        npx cap add android 2>/dev/null || echo "Android platform already added"
        npx cap update android
        npx cap sync android
        echo "✅ Android build ready. Run: npx cap run android"
    else
        echo "⚠️  Android Studio not found. Please install Android Studio and Android SDK"
    fi
}

# iOS Build
build_ios() {
    echo "🍎 Building for iOS..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        if command_exists "xcode-select"; then
            npx cap add ios 2>/dev/null || echo "iOS platform already added"
            npx cap update ios
            npx cap sync ios
            echo "✅ iOS build ready. Run: npx cap run ios"
        else
            echo "⚠️  Xcode not found. Please install Xcode from Mac App Store"
        fi
    else
        echo "⚠️  iOS builds require macOS. Skipping iOS build."
    fi
}

# Electron (Windows/Linux) Build
build_electron() {
    echo "💻 Building for Windows/Linux (Electron)..."
    if command_exists "electron"; then
        npx cap add @capacitor-community/electron 2>/dev/null || echo "Electron platform already added"
        npx cap update @capacitor-community/electron
        npx cap sync @capacitor-community/electron
        echo "✅ Electron build ready. Run: npx cap run @capacitor-community/electron"
    else
        echo "⚠️  Installing Electron platform..."
        npm install @capacitor-community/electron --save-dev
        npx cap add @capacitor-community/electron
        npx cap sync @capacitor-community/electron
        echo "✅ Electron build ready. Run: npx cap run @capacitor-community/electron"
    fi
}

# PWA Build for universal web deployment
build_pwa() {
    echo "🌐 Building PWA for universal deployment..."
    echo "✅ PWA build complete. Deploy 'dist' folder to any web server"
}

# Check arguments
case "$1" in
    android)
        build_android
        ;;
    ios)
        build_ios
        ;;
    electron|desktop)
        build_electron
        ;;
    pwa|web)
        build_pwa
        ;;
    all)
        echo "🚀 Building for all platforms..."
        build_android
        build_ios
        build_electron
        build_pwa
        ;;
    *)
        echo "Usage: $0 {android|ios|electron|pwa|all}"
        echo ""
        echo "Platform options:"
        echo "  android  - Build for Android devices (requires Android Studio)"
        echo "  ios      - Build for iOS devices (requires macOS + Xcode)"
        echo "  electron - Build for Windows/Linux desktop (uses Electron)"
        echo "  pwa      - Build as Progressive Web App"
        echo "  all      - Build for all supported platforms"
        echo ""
        echo "Root detection capabilities:"
        echo "  ✅ Android - Full root detection and system analysis"
        echo "  ✅ iOS     - Jailbreak detection and security monitoring"
        echo "  ✅ Desktop - Process monitoring and system analysis"
        echo "  ✅ Web     - Basic security features"
        exit 1
        ;;
esac

echo ""
echo "🛡️  Guardian AI build complete!"
echo "💡 Remember to test on target platforms for optimal security detection"