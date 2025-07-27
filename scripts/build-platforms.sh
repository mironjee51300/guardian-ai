#!/bin/bash

# Guardian AI Installer Generator Script
# Creates installer files for Android APK, iOS IPA, Windows EXE, Linux AppImage, macOS DMG

echo "🛡️  Guardian AI Installer Generator"
echo "===================================="

# Create release directory for installers
mkdir -p release

# Build web assets
echo "📦 Building web assets..."
npm run build

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Android APK Installer Build
build_android() {
    echo "🤖 Building Android APK installer..."
    npx cap add android 2>/dev/null || echo "Android platform already added"
    npx cap sync android
    
    # Generate release APK
    cd android
    echo "🔨 Generating release APK..."
    ./gradlew assembleRelease
    
    # Copy APK to release directory
    if [ -f "app/build/outputs/apk/release/app-release.apk" ]; then
        cp app/build/outputs/apk/release/app-release.apk ../release/guardian-ai-v1.0.0.apk
        echo "✅ Android APK installer: release/guardian-ai-v1.0.0.apk"
    else
        echo "⚠️  APK build failed or not found"
    fi
    cd ..
}

# iOS IPA Installer Build
build_ios() {
    echo "🍎 Building iOS IPA installer..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        if command_exists "xcode-select"; then
            npx cap add ios 2>/dev/null || echo "iOS platform already added"
            npx cap sync ios
            
            # Build iOS archive and export IPA
            cd ios/App
            echo "🔨 Building iOS archive..."
            xcodebuild -workspace App.xcworkspace -scheme App -configuration Release -archivePath Guardian.xcarchive archive
            
            # Create export options plist
            cat > exportOptions.plist << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>development</string>
    <key>teamID</key>
    <string>TEAM_ID</string>
</dict>
</plist>
EOF
            
            # Export IPA
            echo "🔨 Exporting IPA..."
            xcodebuild -exportArchive -archivePath Guardian.xcarchive -exportPath ../../release -exportOptionsPlist exportOptions.plist
            
            if [ -f "../../release/Guardian AI.ipa" ]; then
                mv "../../release/Guardian AI.ipa" "../../release/guardian-ai-v1.0.0.ipa"
                echo "✅ iOS IPA installer: release/guardian-ai-v1.0.0.ipa"
            else
                echo "⚠️  IPA export failed"
            fi
            cd ../..
        else
            echo "⚠️  Xcode not found. Please install Xcode from Mac App Store"
        fi
    else
        echo "⚠️  iOS builds require macOS. Skipping iOS build."
    fi
}

# Windows EXE Installer Build
build_windows() {
    echo "🪟 Building Windows EXE installer..."
    npx cap add @capacitor-community/electron 2>/dev/null || echo "Electron platform already added"
    npx cap sync @capacitor-community/electron
    
    cd electron
    npm install
    npm install --save-dev electron-builder
    
    # Create electron-builder config
    cat > electron-builder.config.js << EOF
module.exports = {
  appId: 'app.lovable.guardian-ai',
  productName: 'Guardian AI',
  directories: {
    output: '../release'
  },
  files: ['dist/**/*', 'src/**/*'],
  win: {
    target: 'nsis',
    icon: 'assets/icon.ico'
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true,
    createStartMenuShortcut: true
  }
};
EOF
    
    echo "🔨 Building Windows installer..."
    npm run build:win || npx electron-builder --win
    
    if [ -f "../release/Guardian AI Setup *.exe" ]; then
        mv "../release/Guardian AI Setup"*.exe "../release/guardian-ai-windows-setup-v1.0.0.exe"
        echo "✅ Windows installer: release/guardian-ai-windows-setup-v1.0.0.exe"
    else
        echo "⚠️  Windows installer build failed"
    fi
    cd ..
}

# Linux AppImage Installer Build
build_linux() {
    echo "🐧 Building Linux AppImage installer..."
    npx cap add @capacitor-community/electron 2>/dev/null || echo "Electron platform already added"
    npx cap sync @capacitor-community/electron
    
    cd electron
    npm install
    npm install --save-dev electron-builder
    
    echo "🔨 Building Linux AppImage..."
    npm run build:linux || npx electron-builder --linux
    
    if [ -f "../release/Guardian AI-*.AppImage" ]; then
        mv "../release/Guardian AI"*.AppImage "../release/guardian-ai-linux-v1.0.0.AppImage"
        echo "✅ Linux AppImage: release/guardian-ai-linux-v1.0.0.AppImage"
    fi
    
    if [ -f "../release/guardian-ai_*.deb" ]; then
        mv "../release/guardian-ai"*.deb "../release/guardian-ai-linux-v1.0.0.deb"
        echo "✅ Linux DEB package: release/guardian-ai-linux-v1.0.0.deb"
    fi
    cd ..
}

# macOS DMG Installer Build
build_macos() {
    echo "🍎 Building macOS DMG installer..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        npx cap add @capacitor-community/electron 2>/dev/null || echo "Electron platform already added"
        npx cap sync @capacitor-community/electron
        
        cd electron
        npm install
        npm install --save-dev electron-builder
        
        echo "🔨 Building macOS DMG..."
        npm run build:mac || npx electron-builder --mac
        
        if [ -f "../release/Guardian AI-*.dmg" ]; then
            mv "../release/Guardian AI"*.dmg "../release/guardian-ai-macos-v1.0.0.dmg"
            echo "✅ macOS DMG installer: release/guardian-ai-macos-v1.0.0.dmg"
        else
            echo "⚠️  macOS DMG build failed"
        fi
        cd ..
    else
        echo "⚠️  macOS builds require macOS. Skipping macOS build."
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
    windows)
        build_windows
        ;;
    linux)
        build_linux
        ;;
    macos)
        build_macos
        ;;
    mobile)
        echo "📱 Building mobile installers..."
        build_android
        build_ios
        ;;
    desktop)
        echo "💻 Building desktop installers..."
        build_windows
        build_linux
        build_macos
        ;;
    all)
        echo "🚀 Building all installer files..."
        build_android
        build_ios
        build_windows
        build_linux
        build_macos
        ;;
    *)
        echo "Usage: $0 {android|ios|windows|linux|macos|mobile|desktop|all}"
        echo ""
        echo "Installer options:"
        echo "  android  - Generate APK installer for Android"
        echo "  ios      - Generate IPA installer for iOS (requires macOS + Xcode)"
        echo "  windows  - Generate EXE installer for Windows"
        echo "  linux    - Generate AppImage/DEB installers for Linux"
        echo "  macos    - Generate DMG installer for macOS (requires macOS)"
        echo "  mobile   - Generate all mobile installers (APK + IPA)"
        echo "  desktop  - Generate all desktop installers (Windows + Linux + macOS)"
        echo "  all      - Generate installers for all platforms"
        echo ""
        echo "Security features in installers:"
        echo "  🛡️  Mobile malware detection"
        echo "  🔒 Root/Jailbreak detection"
        echo "  🔍 System analysis & monitoring"
        echo "  📧 Email fraud detection"
        echo "  🔐 Password compromise detection"
        echo "  🚨 Real-time threat alerts"
        exit 1
        ;;
esac

echo ""
echo "🛡️  Guardian AI installer generation complete!"
echo "📦 Installer files saved in: release/"
echo ""
echo "Generated files:"
ls -la release/ 2>/dev/null || echo "No installers generated"
echo ""
echo "💡 Installation instructions:"
echo "  📱 Android: Install guardian-ai-v1.0.0.apk on device"
echo "  🍎 iOS: Install guardian-ai-v1.0.0.ipa via TestFlight or developer tools"
echo "  🪟 Windows: Run guardian-ai-windows-setup-v1.0.0.exe as administrator"
echo "  🐧 Linux: chmod +x guardian-ai-linux-v1.0.0.AppImage && ./guardian-ai-linux-v1.0.0.AppImage"
echo "  🍎 macOS: Open guardian-ai-macos-v1.0.0.dmg and drag to Applications"