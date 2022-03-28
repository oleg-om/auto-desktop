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
const { autoUpdater } = require("electron-updater");
const storage = require("electron-json-storage");
const os = require("os");
const appRoot = require("app-root-path");
const Store = require("electron-store");
const printFunc = require("./funcprint");
const razvalPrint = require("./print/razval");
const autopartPrint = require("./print/autopart");
const shinoPrint = require("./print/shinomontazh");
const stoPrint = require("./print/sto");
const tailwind = require("./css/tailwind");

const isDev = !app.isPackaged;

const store = new Store();

if (!store.get("settings")) {
  store.set({
    settings: JSON.stringify({
      printer: "",
      printerbig: "",
      autoprintrazval: false,
      autoprintrazvaltalon: false,
      autoprintautopart: false,
      autoprintshinomontazh: false,
      printshinomontazh: false,
      autoprintsto: false,
      printsto: false,
      shinomontazhnumber: "",
      stonumber: "",
      place: "",
      notifyrazval: false,
      notifyoil: false,
      notifyautopart: false,
    }),
  });
}

const settings = JSON.parse(store.get("settings"));
console.log(settings);

const socket = io("http://195.2.76.23:8090", {
  transports: ["websocket"],
  autoConnect: false,
});
socket.connect();

const html = new htmlCreator();
storage.setDataPath(os.tmpdir());
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 750,
    backgroundColor: "white",
    icon: path.join(__dirname, "src", "img", "icon.png"),
    webPreferences: {
      nodeIntegration: true,
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
      enableRemoteModule: true,
    },
  });
  const contents = win.webContents;

  store.set({ printers: JSON.stringify(contents.getPrinters()) });
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
      // {
      //   label: "Обновить",
      //   click: function () {
      //     autoUpdater.quitAndInstall();
      //   },
      // },
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
  win.once("ready-to-show", () => {
    autoUpdater.checkForUpdatesAndNotify();
  });
  // win.once("ready-to-show", () => {
  //   autoUpdater.checkForUpdates();
  //   new Notification({ title: "Autodom PC", body: "Обновление готово к установке. Перезапустите приложение для установки обновления" }).show();
  // });
  autoUpdater.on("update-available", () => {
    win.webContents.send("update_available");
  });
  autoUpdater.on("update-downloaded", () => {
    win.webContents.send("update_downloaded");
  });
  autoUpdater.on("download-progress", (percent) => {
    win.webContents.send("download-progress", percent);
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

app.whenReady().then(createWindow);

ipcMain.on("newsettings", (_, message) => {
  new Notification({ title: "Autodom PC", body: "Изменения сохранены" }).show();
  store.set({ settings: JSON.stringify(message) });
  JSON.parse(store.get("settings"));
});

const tailwindCss = fs.writeFile(
  app.getPath("userData") + "/tailwind.min.css",
  tailwind,
  (err) => {
    if (err) {
      console.log("Error writing css", err);
    } else {
      console.log("Successfully wrote css");
    }
  }
);

const places = fetch("http://195.2.76.23:8090/api/v1/place")
  .then((response) => response.json())
  .then((data) => data.data)
  .then((data) => JSON.stringify(data))
  .then((data) => store.set({ places: data }))
  // .then((data) =>
  //   fs.writeFile(
  //     path.join(__dirname, "src", "lists", "places.json"),
  //     data,
  //     (err) => {
  //       if (err) {
  //         console.log("Error writing places", err);
  //       } else {
  //         console.log("Successfully wrote places");
  //       }
  //     }
  //   )
  // )
  .catch((err) => console.log(err));
const settingsOfSite = fetch("http://195.2.76.23:8090/api/v1/setting")
  .then((response) => response.json())
  .then((data) => data.data)
  .then((data) => JSON.stringify(data[0]))
  .then((data) => store.set({ settingsofsite: data }))
  // .then((data) =>
  //   fs.writeFile(
  //     path.join(__dirname, "src", "lists", "settingsofsite.json"),
  //     data,
  //     (err) => {
  //       if (err) {
  //         console.log("Error writing settings", err);
  //       } else {
  //         console.log("Successfully wrote settings");
  //         console.log(data.helpphone);
  //       }
  //     }
  //   )
  // )
  .catch((err) => console.log(err));

const optionssmall = {
  silent: true,
  deviceName: settings.printer,
  margins: { marginType: "custom", top: 0, bottom: 0, left: 0, right: 0 },
  copies: 1,
};

const optionssmallTwo = {
  silent: true,
  deviceName: settings.printer,
  margins: { marginType: "custom", top: 0, bottom: 0, left: 0, right: 0 },
  copies: 2,
};

const optionsbig = {
  silent: true,
  deviceName: settings.printerbig,
  margins: { marginType: "custom", top: 0, bottom: 0, left: 0, right: 0 },
  copies: 1,
};

const settingsOfSiteSaved = store.get("settingsofsite")
  ? JSON.parse(store.get("settingsofsite"))
  : [];
const placeList = store.get("places") ? JSON.parse(store.get("places")) : [];
socket.on("update razval", function (data) {
  if (
    settings.place &&
    settings.notifyrazval === true &&
    settings.place !== data.employeeplace &&
    settings.place === data.place
  ) {
    new Notification({
      title: "Autodom PC",
      body: "Новая запись на развал!",
    }).show();
  }
  if (
    settings.place &&
    settings.autoprintrazval === true &&
    data.access !== "false" &&
    settings.place === data.place
  ) {
    razvalPrint(data, "Развал-схождение", placeList);
    printFunc(optionssmall, "/razval.html");
  }
});

socket.on("update oil", function (data) {
  if (
    settings.place &&
    settings.notifyoil === true &&
    settings.place !== data.employeeplace &&
    settings.place === data.place
  ) {
    new Notification({
      title: "Autodom PC",
      body: "Новая запись на замену масла!",
    }).show();
  }
  if (
    settings.place &&
    settings.autoprintrazval === true &&
    data.access !== "false" &&
    settings.place === data.place
  ) {
    razvalPrint(data, "Замена масла", placeList);
    printFunc(optionssmall, "/razval.html");
  }
});

socket.on("update autopart", function (data) {
  if (
    settings.notifyautopart === true &&
    data &&
    settings.place &&
    settings.place !== data.place
  ) {
    new Notification({
      title: "Autodom PC",
      body: "Автозапчасти - новый заказ!",
    }).show();
  }
  if (
    settings.autoprintautopart === true &&
    settings.place &&
    settings.place === data.place
  ) {
    autopartPrint(data, settingsOfSiteSaved, placeList);
    printFunc(optionssmall, "/autopart.html");
    console.log(5);
  }
});

socket.on("shinoneprint", function (data) {
  if (
    settings.printshinomontazh === true &&
    settings.place &&
    settings.place === data.place
  ) {
    shinoPrint(data, settingsOfSiteSaved, placeList);
    printFunc(optionssmall, "/shinomontazh.html");
    console.log(6);
  }
});

socket.on("shintwoprint", function (data) {
  if (
    settings.printshinomontazh === true &&
    settings.place &&
    settings.place === data.place
  ) {
    shinoPrint(data, settingsOfSiteSaved, placeList);
    printFunc(optionssmallTwo, "/shinomontazh.html");
    console.log(7);
  }
});

socket.on("stooneprint", function (data) {
  if (
    settings.printsto === true &&
    settings.place &&
    settings.place === data.place
  ) {
    stoPrint(data, settingsOfSiteSaved, placeList);
    printFunc(optionssmall, "/sto.html");
    console.log(6);
  }
});

socket.on("stotwoprint", function (data) {
  if (
    settings.printsto === true &&
    settings.place &&
    settings.place === data.place
  ) {
    stoPrint(data, settingsOfSiteSaved, placeList);
    printFunc(optionssmallTwo, "/sto.html");
    console.log(7);
  }
});

const template = [
  {
    label: "Просмотр",
    submenu: [
      {
        label: "Обновить",
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

ipcMain.on("app_version", (event) => {
  event.sender.send("app_version", app.getVersion());
});
console.log(app.getVersion());

ipcMain.on("restart_app", () => {
  autoUpdater.quitAndInstall();
});
ipcMain.on("get_settings", (event) => {
  event.sender.send("get_settings", store.get("settings"));
});

ipcMain.on("get_places", (event) => {
  event.sender.send("get_places", store.get("places"));
});

ipcMain.on("get_printers", (event) => {
  event.sender.send("get_printers", store.get("printers"));
});
