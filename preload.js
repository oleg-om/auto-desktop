const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  notificationApi: {
    sendNotification(message) {
      console.log(message);
      ipcRenderer.send("notify", message);
    },
    sendSettings(message) {
      console.log(message);
      ipcRenderer.send("newsettings", message);
    },
  },
  batteryApi: {},
  filesApi: {},
});
