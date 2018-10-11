import * as electron from 'electron'
const app = electron.app
const BrowserWindow = electron.BrowserWindow

import * as isDev from 'electron-is-dev'
import * as path from 'path'
import * as url from 'url'

let mainWindow
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    minWidth: 500,
    minHeight: 500,
    icon: path.join(__dirname, 'icons/coreline-logo.icns'),
  })
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`,
  )
  mainWindow.on('closed', () => (mainWindow = null))

  if (isDev) {
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS,
    } = require('electron-devtools-installer')

    installExtension(REACT_DEVELOPER_TOOLS)
      .then(name => {
        console.log(`Added Extension: ${name}`)
      })
      .catch(err => {
        console.log('An error occurred: ', err)
      })
  }
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
