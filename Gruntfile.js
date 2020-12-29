module.exports = function (grunt) {
  grunt.initConfig({
    "create-windows-installer": {
      ia32: {
        appDirectory: "./",
        outputDirectory: "./dist",
        name: "AutodomPC",
        description: "Auto print and notificatioan app for autodomcrm.ru",
        authors: "olegoriginal",
        exe: "AutodomPC.exe",
      },
    },
  });

  grunt.loadNpmTasks("grunt-electron-installer");
};
