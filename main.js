const {
  BrowserWindow,
  app,
  ipcMain,
  Notification,
  Tray,
  Menu,
} = require("electron");
const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch");
const htmlCreator = require("html-creator");
const io = require("socket.io-client");
const settings = require("./src/lists/settings.json");
const printFunc = require("./funcprint");
const razvalPrint = require("./print/razval");
const autopartPrint = require("./print/autopart");
const settingsOfSiteSaved = require("./src/lists/settingsofsite.json");

const isDev = !app.isPackaged;

if (require("electron-squirrel-startup")) return;

const socket = io("http://195.2.76.23:8090", {
  transports: ["websocket"],
  autoConnect: false,
});
socket.connect();

const html = new htmlCreator();

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 750,
    backgroundColor: "white",
    icon: path.join(__dirname, "src", "img", "icon.png"),
    webPreferences: {
      nodeIntegration: false,
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  const contents = win.webContents;
  fs.writeFile(
    "./src/lists/printers.json",
    JSON.stringify(contents.getPrinters()),
    (err) => {
      if (err) {
        console.log("Error writing printers", err);
      } else {
        console.log("Successfully wrote printers");
      }
    }
  );
  // win.hide();
  win.loadFile("index.html");
  win.on("close", function (event) {
    event.preventDefault();
    win.hide();
  });
  let tray = null;
  app.whenReady().then(() => {
    tray = new Tray(path.join(__dirname, "src", "img", "icon.png"));
    tray.on("click", function (e) {
      win.show();
    });
    const contextMenu = Menu.buildFromTemplate([
      {
        label: "Открыть приложение",
        click: function () {
          win.show();
        },
      },
      {
        label: "Закрыть",
        click: function () {
          win.destroy();
          app.quit();
        },
      },
    ]);
    tray.setToolTip("Система управления Autodom PC");
    tray.setContextMenu(contextMenu);
  });
}

if (isDev) {
  require("electron-reload")(__dirname, {
    electron: path.join(__dirname, "node_modules", ".bin", "electron"),
  });
}

ipcMain.on("notify", (_, message) => {
  new Notification({ title: "Autodom PC", body: message }).show();
});

ipcMain.on("newsettings", (_, message) => {
  new Notification({ title: "Autodom PC", body: "Изменеия сохранены" }).show();
  fs.writeFile(
    path.join(__dirname, "src", "lists", "settings.json"),
    JSON.stringify(message),
    (err) => {
      if (err) {
        console.log("Error writing settings", err);
      } else {
        console.log("Successfully wrote settings");
      }
    }
  );
});

app.whenReady().then(createWindow);

const places = fetch("http://195.2.76.23:8090/api/v1/place")
  .then((response) => response.json())
  .then((data) => data.data)
  .then((data) => JSON.stringify(data))
  .then((data) =>
    fs.writeFile("./src/lists/places.json", data, (err) => {
      if (err) {
        console.log("Error writing places", err);
      } else {
        console.log("Successfully wrote places");
      }
    })
  )
  .catch((err) => console.log(err));

const settingsOfSite = fetch("http://195.2.76.23:8090/api/v1/setting")
  .then((response) => response.json())
  .then((data) => data.data)
  .then((data) => JSON.stringify(data[0]))
  .then((data) =>
    fs.writeFile("./src/lists/settingsofsite.json", data, (err) => {
      if (err) {
        console.log("Error writing settings", err);
      } else {
        console.log("Successfully wrote settings");
        console.log(data.helpphone);
      }
    })
  )
  .catch((err) => console.log(err));

const optionssmall = {
  silent: true,
  deviceName: settings.printer,
  margins: { marginType: "custom", top: 0, bottom: 0, left: 0, right: 0 },
  copies: 1,
};

const optionsbig = {
  silent: true,
  deviceName: settings.printerbig,
  margins: { marginType: "custom", top: 0, bottom: 0, left: 0, right: 0 },
  copies: 1,
};

socket.on("update razval", function (name) {
  console.log(name);
  if (settings.place === name.place && settings.notifyrazval === true) {
    new Notification({
      title: "Autodom PC",
      body: "Новая запись на развал!",
    }).show();
    razvalPrint(name, "Развал-схождение");
    printFunc(optionsbig, "razval.html");
  }
});

socket.on("update oil", function (name) {
  if (settings.place === name.place && settings.notifyoil === true) {
    new Notification({
      title: "Autodom PC",
      body: "Новая запись на замену масла!",
    }).show();
    razvalPrint(name, "Замена масла");
    printFunc(optionssmall, "razval.html");
  }
});

socket.on("update autopart", function (name) {
  if (
    settings.place !== name.employeeplace &&
    settings.notifyautopart === true
  ) {
    new Notification({
      title: "Autodom PC",
      body: "Автозапчасти - новый заказ!",
    }).show();
    autopartPrint(name, settingsOfSiteSaved);
    printFunc(optionssmall, "autopart.html");
  }
});

const template = [
  {
    label: "Edit",
    submenu: [
      {
        role: "undo",
      },
      {
        role: "redo",
      },
      {
        type: "separator",
      },
      {
        role: "cut",
      },
      {
        role: "copy",
      },
      {
        role: "paste",
      },
      {
        role: "pasteandmatchstyle",
      },
      {
        role: "delete",
      },
      {
        role: "selectall",
      },
    ],
  },
  {
    label: "View",
    submenu: [
      {
        label: "Reload",
        accelerator: "CmdOrCtrl+R",
        click(item, focusedWindow) {
          if (focusedWindow) focusedWindow.reload();
        },
      },
      {
        label: "Toggle Developer Tools",
        accelerator:
          process.platform === "darwin" ? "Alt+Command+I" : "Ctrl+Shift+I",
        click(item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.toggleDevTools();
        },
      },
      {
        type: "separator",
      },
      {
        role: "resetzoom",
      },
      {
        role: "zoomin",
      },
      {
        role: "zoomout",
      },
      {
        type: "separator",
      },
      {
        role: "togglefullscreen",
      },
    ],
  },
  {
    role: "window",
    label: "Окно",
    submenu: [
      {
        label: "Свернуть",
        role: "minimize",
      },
      {
        label: "Закрыть",
        role: "close",
      },
    ],
  },
  {
    role: "help",
    label: "Помощь",
    submenu: [
      {
        label: "Веб версия",
        click() {
          require("electron").shell.openExternal("http://autodomcrm.ru");
        },
      },
    ],
  },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
