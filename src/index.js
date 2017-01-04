const {
  app, BrowserWindow, Tray, Menu, globalShortcut
} = require('electron')
const Positioner = require('electron-positioner')
const path = require('path')
const { readJSON, outputJSON } = require('fs-extra')

let tray, win, positioner

const CONFIG_PATH = path.join(
  app.getPath('userData'),
  'config.json'
)

const CLIENT_ID = '7eff5005846f8ac6bd32d417a55eb5d5'

app.on('ready', () => {
  // MacOS: Hide the dock icon
  // if (app.dock) app.dock.hide()

  readJSON(CONFIG_PATH, (err, data) => {
    if (!err && data.client_id && data.oauth_token) {
      startApp()
    } else {
      authenticateUser()
    }
  })
})

function authenticateUser () {
  let connectURL = 'https://soundcloud.com/connect?' +
    `client_id=${CLIENT_ID}` +
    '&display=popup&response_type=token' +
    '&redirect_uri=cloudplayer%3A%2F%2Fcallback.html'

  const authWindow = new BrowserWindow({
    width: 500,
    height: 500,
    frame: false,
    resizeable: false,
    show: false
  })

  authWindow.once('ready-to-show', () => {
    let positioner = new Positioner(authWindow)
    positioner.move('center')
    authWindow.show()
  })

  authWindow.loadURL(connectURL)

  authWindow.webContents.on('did-get-redirect-request', (_e, _oldUrl, newUrl) => {
    let token = newUrl.match(/access_token=([^&]+)/)[1]

    outputJSON(CONFIG_PATH, {
      client_id: CLIENT_ID,
      oauth_token: token
    }, () => {
      startApp()
      authWindow.destroy()
    })
  })
}

function startApp () {
  // ========================================================
  // Tray setup

  tray = new Tray(path.join(app.getAppPath(), 'static', 'IconTemplate.png'))
  tray.setToolTip(app.getName())
  tray.on('click', toggleWindow)

  if (process.platform === 'linux') {
    tray.setContextMenu(contextMenu)
  } else {
    tray.on('right-click', () => tray.popUpContextMenu(contextMenu))
  }

  // ========================================================
  // Window setup

  win = new BrowserWindow({
    width: 500,
    height: 400,
    transparent: true,
    frame: false,
    resizeable: false,
    show: false
  })

  positioner = new Positioner(win)

  win.once('ready-to-show', showWindow)

  win.on('blur', () => {
    if (win.webContents.isDevToolsOpened()) return
    win.hide()
  })

  win.loadURL(`file://${path.join(app.getAppPath(), 'static', 'index.html')}`)

  // ========================================================
  // Global shortcuts

  app.on('will-quit', () => globalShortcut.unregisterAll())

  globalShortcut.register('MediaPlayPause', () => {
    win.webContents.send('togglePlay')
  })
}

// ==========================================================
// Tray context menu

const contextMenu = Menu.buildFromTemplate([
  {
    label: 'Refresh',
    click: () => win.webContents.send('refresh')
  },
  { type: 'separator' },
  { role: 'quit' }
])

// ==========================================================
// Helpers

function showWindow () {
  positionWindow()
  win.show()
}

function positionWindow () {
  if (process.platform === 'darwin') {
    let { x, y } = positioner.calculate('trayCenter', tray.getBounds())
    win.setPosition(x, y + 5)
  } else if (process.platform === 'win32') {
    let { x, y } = positioner.calculate('trayBottomCenter', tray.getBounds())
    win.setPosition(x, y - 5)
  } else if (process.platform === 'linux') {
    let { x, y } = positioner.calculate('topRight')
    win.setPosition(x - 5, y + 5)
  }
}

function toggleWindow () {
  win.isVisible() ? win.hide() : showWindow()
}
