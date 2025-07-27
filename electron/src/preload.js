const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // System information
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  getRunningProcesses: () => ipcRenderer.invoke('get-running-processes'),
  
  // Security features
  onSecurityUpdate: (callback) => {
    ipcRenderer.on('security-update', callback);
  },
  
  onTriggerScan: (callback) => {
    ipcRenderer.on('trigger-scan', callback);
  },
  
  onUpdateThreats: (callback) => {
    ipcRenderer.on('update-threats', callback);
  },
  
  onOpenSettings: (callback) => {
    ipcRenderer.on('open-settings', callback);
  },
  
  // Platform detection
  platform: process.platform,
  isElectron: true,
  
  // App information
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // Cleanup listeners
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
});

// Security: Remove access to Node.js APIs
delete window.require;
delete window.exports;
delete window.module;