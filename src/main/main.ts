import { autoUpdater } from "electron-updater";
import { app, BrowserWindow } from "electron";
declare var __dirname: string;
let mainWindow: Electron.BrowserWindow;

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

    mainWindow.loadURL(`file://${__dirname}/index.html`);
    mainWindow.on("close", () => app.quit());
    autoUpdater.checkForUpdatesAndNotify();
}

app.on("ready", () => onReady());
app.on("window-all-closed", () => app.quit());
console.log(`Electron Version ${app.getVersion()}`);