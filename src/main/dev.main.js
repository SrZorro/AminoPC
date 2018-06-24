const autoUpdater = require("electron-updater").autoUpdater;
const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

function onReady() {
    mainWindow = new BrowserWindow({
        height: 700,
        minHeight: 700,
        minWidth: 390,
        width: 390,
        webPreferences: {
            webSecurity: false
        }
    });

    // mainWindow.setMenu(null);

    mainWindow.loadURL("http://127.0.0.1:3000");
    mainWindow.on("close", () => app.quit());
    autoUpdater.checkForUpdatesAndNotify();
}

app.on("ready", () => onReady());
app.on("window-all-closed", () => app.quit());
console.log(`Electron Version ${app.getVersion()}`);