import { app, BrowserWindow, ipcMain } from 'electron'
import * as isDev from 'electron-is-dev'
import { join } from 'path'
import { googleSignIn } from './google-login'
import { readToken, saveToken } from './utils'

let mainWindow
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    minWidth: 500,
    minHeight: 500,
    icon: join(__dirname, 'icons/coreline-logo.icns'),
  })
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${join(__dirname, '../build/index.html')}`)
  mainWindow.on('closed', () => (mainWindow = null))

  if (isDev) {
    const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer')

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

ipcMain.on('login', async (event, arg) => {
  const { token, user } = await googleSignIn()
  await saveToken(token)

  return event.sender.send('reply', { user, token })
})

ipcMain.on('jwt', async (event, arg) => {
  const token = await readToken()
  event.sender.send('jwt-reply', token)
})
