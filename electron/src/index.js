const { app, BrowserWindow, Menu, shell, dialog, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

// Keep a global reference of the window object
let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, '../assets/icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'default',
    show: false
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Focus on the window
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Security: Prevent navigation to external websites
  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    
    if (parsedUrl.origin !== 'http://localhost:5173' && !navigationUrl.startsWith('file://')) {
      event.preventDefault();
    }
  });
}

// App event handlers
app.whenReady().then(() => {
  createWindow();
  
  // Create application menu
  createMenu();
  
  // Check for updates
  if (!isDev) {
    autoUpdater.checkForUpdatesAndNotify();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Create application menu
function createMenu() {
  const template = [
    {
      label: 'Guardian AI',
      submenu: [
        {
          label: 'About Guardian AI',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About Guardian AI',
              message: 'Guardian AI v1.0.0',
              detail: 'Advanced Security Monitoring & Threat Detection Platform\n\nProtecting your digital assets with AI-powered security.'
            });
          }
        },
        { type: 'separator' },
        {
          label: 'Check for Updates',
          click: () => {
            if (!isDev) {
              autoUpdater.checkForUpdatesAndNotify();
            } else {
              dialog.showMessageBox(mainWindow, {
                type: 'info',
                title: 'Updates',
                message: 'Auto-updates are disabled in development mode.'
              });
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Security',
      submenu: [
        {
          label: 'Run System Scan',
          accelerator: 'Ctrl+Shift+S',
          click: () => {
            mainWindow.webContents.send('trigger-scan');
          }
        },
        {
          label: 'Update Threat Database',
          click: () => {
            mainWindow.webContents.send('update-threats');
          }
        },
        { type: 'separator' },
        {
          label: 'Security Settings',
          click: () => {
            mainWindow.webContents.send('open-settings');
          }
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Documentation',
          click: () => {
            shell.openExternal('https://docs.lovable.dev');
          }
        },
        {
          label: 'Report Issue',
          click: () => {
            shell.openExternal('https://github.com/lovable-dev/guardian-ai/issues');
          }
        },
        { type: 'separator' },
        {
          label: 'Contact Support',
          click: () => {
            shell.openExternal('mailto:support@lovable.dev');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Auto-updater events
autoUpdater.on('checking-for-update', () => {
  console.log('Checking for update...');
});

autoUpdater.on('update-available', (info) => {
  console.log('Update available.');
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'Update Available',
    message: 'A new version is available. It will be downloaded in the background.',
    detail: `Version ${info.version} is available for download.`
  });
});

autoUpdater.on('update-not-available', (info) => {
  console.log('Update not available.');
});

autoUpdater.on('error', (err) => {
  console.log('Error in auto-updater. ' + err);
});

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  console.log(log_message);
});

autoUpdater.on('update-downloaded', (info) => {
  console.log('Update downloaded');
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'Update Ready',
    message: 'Update downloaded. Application will restart to apply the update.',
    buttons: ['Restart Now', 'Later']
  }).then((result) => {
    if (result.response === 0) {
      autoUpdater.quitAndInstall();
    }
  });
});

// IPC handlers for security features
ipcMain.handle('get-system-info', async () => {
  const os = require('os');
  return {
    platform: os.platform(),
    arch: os.arch(),
    release: os.release(),
    hostname: os.hostname(),
    memory: os.totalmem(),
    cpu: os.cpus()[0]?.model || 'Unknown'
  };
});

ipcMain.handle('get-running-processes', async () => {
  // In a real implementation, you would use system APIs
  // This is a placeholder for demonstration
  return {
    total: 150,
    suspicious: 2,
    processes: [
      { name: 'system', cpu: 5, memory: 1024, suspicious: false },
      { name: 'suspicious_app.exe', cpu: 25, memory: 2048, suspicious: true }
    ]
  };
});

// Security monitoring
setInterval(() => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    // Send periodic security updates
    mainWindow.webContents.send('security-update', {
      timestamp: Date.now(),
      status: 'monitoring',
      threatsDetected: Math.floor(Math.random() * 3)
    });
  }
}, 30000); // Every 30 seconds
