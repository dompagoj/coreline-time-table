import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { format as formatUrl } from 'url'
import { googleSignIn } from './google-login'
import { deleteToken, readToken, saveToken } from './utils'

const isDevelopment = process.env.NODE_ENV !== 'production'

let mainWindow: BrowserWindow | null = null
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

function createMainWindow() {
  const window = new BrowserWindow({
    width: 900,
    height: 680,
    minWidth: 900,
    minHeight: 680,
  })
  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
  } else {
    window.loadURL(
      formatUrl({
        pathname: join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true,
      }),
    )
  }

  window.on('closed', () => {
    mainWindow = null
  })

  window.webContents.on('devtools-opened', () => {
    window.focus()
    setImmediate(() => {
      window.focus()
    })
  })

  return window
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
})

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow()
})

ipcMain.on('login', async (event, arg) => {
  const { data, status } = await googleSignIn()
  if (status >= 400) {
    return event.sender.send('reply', { error: data.error })
  }
  const { token, user, authKey } = data
  await saveToken(token)

  return event.sender.send('reply', { user, token, authKey })
})

ipcMain.on('jwt', async (event, arg) => {
  const token = await readToken()
  event.sender.send('jwt-reply', token)
})

ipcMain.on('logout', async (event, arg) => {
  const result = await deleteToken()
  event.sender.send('logout-reply', result)
})
