const menubar = require('menubar');
const { Menu } = require('electron');

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
    role: 'quit'
  }
]);

mb.on('ready', () => {
  mb.tray.setContextMenu(contextMenu);
  mb.showWindow();
});
