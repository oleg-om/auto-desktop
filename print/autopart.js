const fs = require("fs");
const placeList = require("../src/lists/places.json");

const autopartPrint = (name, settings) => {
  const place = placeList.find((it) => it.id === name.place);
  const preorder = `${
    name.preorder
      ? name.preorder.map(
          (it) =>
            `<p>${it.autopartItem} ${
              it.quantity ? `- ${it.quantity} шт` : ""
            }</p>`
        )
      : null
  }`;
  const date = `${new Date(name.date)
    .getDate()
    .toString()
    .replace(/^(\d)$/, "0$1")}
              .${(new Date(name.date).getMonth() + 1)
                .toString()
                .replace(/^(\d)$/, "0$1")}
              .${new Date(name.date).getFullYear()}
              `;
  const currentPlace = placeList.find((it) => it.id === name.place);
  const check = `<!DOCTYPE html><html lang="ru"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" type="text/css" href="../css/tailwind.min.css" /> <title>Печать</title><body>
  <div class="w-full p-5">
      <h3 class="text-center text-lg font-bold">
        Номер заказа ${name.id_autoparts}
      </h3>
      <div
        class="flex justify-between mb-3 text-sm border-b-2 border-black pb-3"
      >
        <p>Заказ:</p>
        <div class="flex flex-col text-right">
          ${preorder}
        </div>
      </div>
      <div class="flex justify-between text-sm">
        <p>Предоплата:</p>
        ${name.prepay ? `<p>${name.prepay}</p>` : `<p>Нет</p>`}
      </div>
      <div class="flex justify-between text-sm">
        <p>Дата оформления заказа:</p>

        <p>
          ${date}
        </p>
      </div>
      ${
        placeList
          ? `<div class="flex justify-between mb-3 text-sm border-b-2 border-black pb-3">
            <p>Адрес:</p>

            <p>
              ${currentPlace.name}
            </p>
          </div>`
          : null
      } ${
    currentPlace.autopartsphone && placeList
      ? `
      <div class="flex justify-between text-sm">
        <p>Вопросы по заказу:</p>

        <p class="font-bold">${currentPlace.autopartsphone}</p>
      </div>
    `
      : ""
  }
      <div class="mt-3 mb-1 w-full text-sm">
        <p>Если вы недовольны качеством обслуживания обратитесь:</p>
      </div>
      ${
        settings.helpphone
          ? `<div class="flex justify-between text-sm">
        <p>Контроль качества:</p>

        <p>${settings.helpphone}</p>
      </div>`
          : null
      }
      <h2 class="text-center text-lg mt-2 font-bold">Спасибо за заказ!</h2>
    </div></body>`;
  fs.writeFile("./temp/autopart.html", check, (err) => {
    if (err) {
      console.log("Error writing autopart html", err);
    } else {
      console.log("Successfully wrote autopart html");
    }
  });
};

module.exports = autopartPrint;
