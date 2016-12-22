const menubar = require('menubar');

const mb = menubar({
  dir: process.cwd() + '/app',
  transparent: true,
  skipTaskbar: true,
  width: 500,
  height: 400
});

mb.on('ready', () => {
  mb.showWindow();
});
