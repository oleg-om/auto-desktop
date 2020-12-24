const { BrowserWindow } = require("electron");
const path = require("path");

const printFunc = (options, itemPath) => {
  let win = new BrowserWindow({ show: false });
  win.once("ready-to-show", () => win.hide());
  win.loadURL(`file://${path.join(__dirname, "temp", itemPath)}`);
  win.webContents.on("did-finish-load", () => {
    win.webContents.print(options, (success, errorType) => {
      if (!success) {
        console.log(errorType);
      }
      win.destroy();
    });
  });
};

module.exports = printFunc;
