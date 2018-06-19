import { app, BrowserWindow } from "electron";
import * as path from "path";
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
}

app.on("ready", () => onReady());
app.on("window-all-closed", () => app.quit());
console.log(`Electron Version ${app.getVersion()}`);