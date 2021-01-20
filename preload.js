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
    getSettings(message) {
      console.log(message);
      ipcRenderer.send("newsettings", message);
    },
  },
  batteryApi: {},
  filesApi: {},
  api: {
    send: (channel, data) => {
      // whitelist channels
      let validChannels = ["toMain"];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    receive: (channel, func) => {
      let validChannels = [
        "fromMain",
        "app_version",
        "get_settings",
        "get_places",
        "get_printers",
      ];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.send(channel);
        ipcRenderer.on(channel, (event, ...args) => {
          ipcRenderer.removeAllListeners(channel);
          func(...args);
        });
      }
    },
  },
  updateApi: {
    new: (channel, func) => {
      ipcRenderer.send(channel);
      ipcRenderer.on(channel, (event, ...args) => {
        ipcRenderer.removeAllListeners(channel);
        func(...args);
      });
    },
    taken: (channel, func) => {
      ipcRenderer.send(channel);
      ipcRenderer.on(channel, (event, ...args) => {
        ipcRenderer.removeAllListeners(channel);
        func(...args);
      });
    },
    restart: (channel, func) => {
      ipcRenderer.send("restart_app");
    },
  },
});
