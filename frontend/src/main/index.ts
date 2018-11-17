import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { format as formatUrl } from 'url'
import { googleSignIn } from './google-login'
import { deleteToken, readToken, saveToken } from './utils'

const isDev = process.env.NODE_ENV !== 'production';

let mainWindow
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    minWidth: 900,
    minHeight: 680,
  })
  mainWindow.loadURL(isDev ? `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}` : formatUrl({
    pathname: join(__dirname, 'index.html'),
    protocol: 'file',
    slashes: true
  }))
  mainWindow.on('closed', () => (mainWindow = null))
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
  const { data, status } = await googleSignIn()
  if (status >= 400) {
    return event.sender.send('reply', { error: data.error })
  }
  const { token, user } = data
  await saveToken(token)

  return event.sender.send('reply', { user, token })
})

ipcMain.on('jwt', async (event, arg) => {
  const token = await readToken()
  event.sender.send('jwt-reply', token)
})

ipcMain.on('logout', async (event, arg) => {
  const result = await deleteToken()
  event.sender.send('logout-reply', result)
})
