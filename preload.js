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
  api: {
    send: (channel, data) => {
      // whitelist channels
      let validChannels = ["toMain"];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    receive: (channel, func) => {
      let validChannels = ["fromMain", "app_version"];
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
      ipcRenderer.on("update_available", () => {
        ipcRenderer.removeAllListeners("update_available");
        message.innerText = "A new update is available. Downloading now...";
        notification.classList.remove("hidden");
      });
    },
    taken: (channel, func) => {
      ipcRenderer.on("update_downloaded", () => {
        ipcRenderer.removeAllListeners("update_downloaded");
        message.innerText =
          "Update Downloaded. It will be installed on restart. Restart now?";
        restartButton.classList.remove("hidden");
        notification.classList.remove("hidden");
      });
    },
    restart: (channel, func) => {
      ipcRenderer.send("restart_app");
    },
  },
});
