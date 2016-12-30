const { app, BrowserWindow, Tray, Menu, globalShortcut } = require("electron");
const Positioner = require("electron-positioner");
const path = require("path");

let tray, win, positioner;

app.on("ready", () => {
  // MacOS: Hide the dock icon
  if (app.dock) app.dock.hide();

  // ========================================================
  // Tray setup

  tray = new Tray(path.join(__dirname, "IconTemplate.png"));
  tray.setToolTip(app.getName());
  tray.on("click", toggleWindow);

  if (process.platform == "linux") {
    tray.setContextMenu(contextMenu);
  } else {
    tray.on("right-click", () => tray.popUpContextMenu(contextMenu));
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
  });

  positioner = new Positioner(win);

  win.once("ready-to-show", showWindow);

  win.on("blur", () => {
    if (win.webContents.isDevToolsOpened()) return;
    win.hide();
  });

  win.loadURL(`file://${path.join(__dirname, "index.html")}`);

  // ========================================================
  // Global shortcuts

  app.on("will-quit", () => globalShortcut.unregisterAll());

  globalShortcut.register("MediaPlayPause", () => {
    win.webContents.send("togglePlay");
  });
});


// ==========================================================
// Tray context menu

const contextMenu = Menu.buildFromTemplate([
  {
    label: "Refresh",
    click: () => win.webContents.send("refresh")
  },
  { type: "separator" },
  { role: "quit" }
]);


// ==========================================================
// Helpers

function showWindow() {
  let { x, y } = {
    darwin: () => positioner.calculate("trayCenter", tray.getBounds()),
    win32:  () => positioner.calculate("trayBottomCenter", tray.getBounds()),
    linux:  () => positioner.calculate("topRight")
  }[process.platform]();
  win.setPosition(x, y);
  win.show();
}

function toggleWindow() {
  win.isVisible() ? win.hide() : showWindow();
}
