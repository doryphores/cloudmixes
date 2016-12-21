const menubar = require('menubar');

const mb = menubar({
  dir: process.cwd() + '/app',
  transparent: true,
  skipTaskbar: true,
  width: 600,
  height: 600
});

mb.on('ready', () => {
  mb.showWindow();
});
