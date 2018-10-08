"use strict";
exports.__esModule = true;
var electron = require("electron");
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var isDev = require("electron-is-dev");
var path = require("path");
var mainWindow;
function createWindow() {
    mainWindow = new BrowserWindow({ width: 900, height: 680 });
    mainWindow.loadURL(isDev ? 'http://localhost:3000' : "file://" + path.join(__dirname, '../build/index.html'));
    mainWindow.on('closed', function () { return mainWindow = null; });
}
app.on('ready', createWindow);
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});
