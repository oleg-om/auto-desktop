const { app } = require("electron");
const fs = require("fs");

const razvalPrint = (data, service, placeList) => {
  console.log(data.mark);
  const placeInfo = placeList.find((it) => it.id === data.place)
    ? placeList.find((it) => it.id === data.place)
    : { name: "" };
  const propsDate = new Date(data.date);
  const dateActive = `${propsDate
    .getDate()
    .toString()
    .replace(/^(\d)$/, "0$1")}.${(propsDate.getMonth() + 1)
    .toString()
    .replace(/^(\d)$/, "0$1")}.${propsDate.getFullYear()}`.toString();

  const check = `<!DOCTYPE html>
<html lang="en"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" type="text/css" href="./tailwind.min.css" />
  <title>Печать</title><body><div class="w-full p-5"> <h3 class="text-center text-lg font-bold mb-2">Талон на запись</h3> <div class="flex justify-between text-sm mb-2"> <p>Дата:</p> <p> ${dateActive} ${data.time} </p> </div> <div class="flex justify-between text-sm mb-2"> <p>Услуга:</p> <p>${service}</p> </div> <div class="flex justify-between text-xs mb-2"> <p>Адрес:</p> <p>${placeInfo.name}</p> </div> <div class="flex justify-between mb-3 text-sm border-b-2 border-black pb-3"> <p>Телефон:</p> <p>${placeInfo.razvalphone}</p> </div> <div class="f-full mb-3 text-sm"> <p>Приедьте за 20 минут до начала проведения работ</p> </div> </div></body>`;
  fs.writeFile(app.getPath("userData") + "/razval.html", check, (err) => {
    if (err) {
      console.log("Error writing razval html", err);
    } else {
      console.log("Successfully wrote razval html");
    }
  });
};

module.exports = razvalPrint;
