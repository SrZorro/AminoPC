import { app, BrowserWindow } from "electron";
import * as path from "path";
declare var __dirname: string
let mainWindow: Electron.BrowserWindow

function onReady() {
  mainWindow = new BrowserWindow({
    minHeight: 700,
    minWidth: 390,
    width: 390,
    height: 700,
    webPreferences: {
      webSecurity: false
    }
  })

  // mainWindow.setMenu(null);

  console.log(__dirname)
  // const fileName = `file://${__dirname}/index.html`
  mainWindow.loadURL(process.env.DEBUG ? "http://localhost:8000" : path.join(__dirname, "..", "src", "index.html"))
  mainWindow.on("close", () => app.quit())
}

app.on("ready", () => onReady())
app.on("window-all-closed", () => app.quit())
console.log(`Electron Version ${app.getVersion()}`)