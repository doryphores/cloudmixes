const { app, BrowserWindow, Tray, Menu, globalShortcut } = require("electron");
const Positioner = require("electron-positioner");
const path = require("path");
const Player = require("mpris-service");

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

  var mprisPlayer = Player({
    canRaise: true,
    name: "cloudmixes",
    identity: "Cloud mixes",
    desktopEntry: "cloudmixes",
    supportedInterfaces: ["player"],
    supportedUriSchemes: ["file"],
    supportedMimeTypes: ["audio/mpeg", "application/ogg"]
  });

  mprisPlayer.canControl = true;

  mprisPlayer.play = function (trackid, length, artwork, title, artist) {
    length = 0; // UNSUPPORTED

    mprisPlayer.metadata = {
      "mpris:trackid": mprisPlayer.objectPath("track/" + trackid),
      "mpris:length": length,
      "mpris:artUrl": artwork,
      "xesam:title": title,
      "xesam:album": "",
      "xesam:artist": artist
    };

    // Tell dbus/mpris that we're currently playing.
    mprisPlayer.playbackStatus = "Playing";
  }

  mprisPlayer.pause = function() {
    mprisPlayer.playbackStatus = "Paused";
  };

  mprisPlayer.stop = function() {
    mprisPlayer.playbackStatus = "Stopped";
  };

  mprisPlayer.playbackStatus = mprisPlayer.playbackStatus || "Stopped";

  mprisPlayer.on("playpause", function() {
    console.log('HELLO');
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
