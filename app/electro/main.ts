import { app, BrowserWindow } from "electron"
declare var __dirname: string
let mainWindow: Electron.BrowserWindow

function onReady() {
  mainWindow = new BrowserWindow({
    minHeight: 480,
    minWidth: 390,
    width: 390,
    height: 600,
    webPreferences: {
      webSecurity: false
    }
  })

  // mainWindow.setMenu(null);

  console.log(__dirname)
  // const fileName = `file://${__dirname}/index.html`
  mainWindow.loadURL("http://localhost:8000")
  mainWindow.on("close", () => app.quit())
}

app.on("ready", () => onReady())
app.on("window-all-closed", () => app.quit())
console.log(`Electron Version ${app.getVersion()}`)