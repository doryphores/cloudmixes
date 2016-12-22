const menubar = require('menubar');
const { Menu, globalShortcut } = require('electron');

const mb = menubar({
  dir: process.cwd() + '/app',
  transparent: true,
  skipTaskbar: true,
  width: 500,
  height: 400,
  tooltip: 'Cloud mixes'
});

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

mb.on('ready', () => {
  globalShortcut.register('MediaPlayPause', () => {
    mb.window.webContents.send('togglePlay');
  });

  mb.tray.setContextMenu(contextMenu);

  mb.app.on('will-quit', () => {
    globalShortcut.unregisterAll();
  });

  mb.showWindow();
});
