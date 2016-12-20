const menubar = require('menubar');

const mb = menubar({
  dir: process.cwd() + '/app',
  transparent: true,
  skipTaskbar: true
});

mb.on('ready', () => {
  mb.showWindow();
});
