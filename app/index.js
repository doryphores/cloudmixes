const { app, BrowserWindow, Tray, Menu, globalShortcut } = require('electron');
const path = require('path');

let tray, win;

app.on('ready', () => {
  if (app.dock) app.dock.hide();
  
  tray = new Tray(path.join(__dirname, 'IconTemplate.png'));
  tray.setToolTip(app.getName());
  tray.on('click', () => {
    toggleWindow();
  });

  tray.on('right-click', () => {
    tray.popUpContextMenu(contextMenu);
  });

  globalShortcut.register('MediaPlayPause', () => {
    win.webContents.send('togglePlay');
  });

  win = new BrowserWindow({
    width: 500,
    height: 400,
    skipTaskbar: true,
    transparent: true,
    frame: false,
    resizeable: false,
    show: false
  });

  win.once('ready-to-show', () => {
    win.show();
  });

  win.loadURL(`file://${path.join(__dirname, 'index.html')}`);

  win.on('blur', () => {
    win.hide();
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

function toggleWindow() {
  if (win.isVisible()) {
    win.hide();
  } else {
    win.show();
  }
}

const contextMenu = Menu.buildFromTemplate([
  {
    label: 'Refresh',
    click: () => mb.window.webContents.send('refresh')
  },
  {
    type: 'separator'
  },
  {
    role: 'quit'
  }
]);
