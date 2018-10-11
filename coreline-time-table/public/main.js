"use strict";
exports.__esModule = true;
var electron = require("electron");
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var isDev = require("electron-is-dev");
var path = require("path");
var mainWindow;
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 680,
        minWidth: 500,
        minHeight: 500,
        icon: path.join(__dirname, 'icons/coreline-logo.icns')
    });
    mainWindow.loadURL(isDev
        ? 'http://localhost:3000'
        : "file://" + path.join(__dirname, '../build/index.html'));
    mainWindow.on('closed', function () { return (mainWindow = null); });
    if (isDev) {
        var _a = require('electron-devtools-installer'), installExtension = _a["default"], REACT_DEVELOPER_TOOLS = _a.REACT_DEVELOPER_TOOLS;
        installExtension(REACT_DEVELOPER_TOOLS)
            .then(function (name) {
            console.log("Added Extension: " + name);
        })["catch"](function (err) {
            console.log('An error occurred: ', err);
        });
    }
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
