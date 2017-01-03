import { app, BrowserWindow, Tray, Menu, globalShortcut } from 'electron'
import Positioner from 'electron-positioner'
import path from 'path'

let tray, win, positioner

app.on('ready', () => {
  // MacOS: Hide the dock icon
  if (app.dock) app.dock.hide()

  // ========================================================
  // Tray setup

  tray = new Tray(path.join(app.getAppPath(), 'IconTemplate.png'))
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
    skipTaskbar: true,
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

  win.loadURL(`file://${path.join(app.getAppPath(), 'index.html')}`)

  // ========================================================
  // Global shortcuts

  app.on('will-quit', () => globalShortcut.unregisterAll())

  globalShortcut.register('MediaPlayPause', () => {
    win.webContents.send('togglePlay')
  })
})

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
