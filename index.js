const menubar = require('menubar');

const mb = menubar({
  dir: process.cwd() + '/app'
});

mb.on('ready', () => {
  mb.showWindow();
});
