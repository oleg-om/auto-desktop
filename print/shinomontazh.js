const { app } = require("electron");
const fs = require("fs");

const shinoPrint = (name, settings, placeList) => {

  const modifyEmployees = (emp) => {
    if (!emp || !emp?.length) {
      return ''
    }
    return (
      `${emp
        .map(
          (it) =>
            `${it.numberId
              ? `${it.numberId}`
              : `${it.name ? `${it.name} ${it.surname}` : ""}`
            }`
        )
        .join(", ")
      }`
    )
  }

  const modifyServices = (ser) => {
    if (!ser || !ser?.length) {
      return ''
    }
    return (
      `${ser
        .map(
          (it) =>
            `<p>${it.name} ${it.price ? `- ${it.price} р.` : ""} ${it.quantity ? `- ${it.quantity} шт` : ""
            }</p>`
        )
        .join("")
      }`
    )
  }

  const place = placeList.find((it) => it.id === name.place);
  const preorder = modifyServices(name.services)
  const preorderGroup = (group) => modifyServices(name.services?.filter((item) => item?.group === group))

  const employeeMain = modifyEmployees(name.employee?.filter((item) => item.role === "main"))
  const employeeGroup = (group) => modifyEmployees(name.employee?.filter((item) => item?.group === group))

  const employeeSecond = modifyEmployees(name.employee?.filter((item) => item.role === "second"))

  const material = modifyServices(name.material)
  const materialGroup = (group) => modifyServices(name.material?.filter((item) => item?.group === group))

  const date = `${new Date(name.dateFinish)
    .getDate()
    .toString()
    .replace(/^(\d)$/, "0$1")}
              .${(new Date(name.dateFinish).getMonth() + 1)
      .toString()
      .replace(/^(\d)$/, "0$1")}
              .${new Date(name.dateFinish).getFullYear()}
              `;
  const time = `${new Date(name.dateFinish)
    .getHours()
    .toString()
    .replace(/^(\d)$/, "0$1")}
                          :${new Date(name.dateFinish)
      .getMinutes()
      .toString()
      .replace(/^(\d)$/, "0$1")}
                          `;
  const currentPlace = placeList.find((it) => it.id === name.place);

  const thereAreGroups = name?.groupCount === 2

  const check = `<!DOCTYPE html><html lang="ru"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" type="text/css" href="./tailwind.min.css" /> <title>Печать</title><body>
  <div class="w-full px-5 pb-5">
      ${thereAreGroups ?
      `<div>
        ${
          employeeGroup(1)
            ? `<div class="flex justify-between text-xs">
              <p>Исп. (группа 1): </p>

              <p class="text-right">
                ${employeeGroup(1)}
              </p>
            </div>`
            : ""
        }
        ${
          employeeGroup(2)
            ? `<div class="flex justify-between text-xs">
              <p>Исп. (группа 2): </p>

              <p class="text-right">
                ${employeeGroup(2)}
              </p>
            </div>`
            : ""
        }
      </div>`
      :
      `<div>
        ${
          employeeMain
            ? `<div class="flex justify-between text-xs">
              <p>Ст. см: </p>

              <p class="text-right">
                ${employeeMain}
              </p>
            </div>`
            : ""
        }
        ${
          employeeSecond
            ? `<div class="flex justify-between text-xs">
              <p>Исп: </p>

              <p class="text-right">
                ${employeeSecond}
              </p>
            </div>`
            : ""
        }
      </div>`}
      ${placeList
      ? `<div class="flex justify-between mb-1 text-xs pb-1">
            <p>Адрес:</p>

            <p>
              ${currentPlace.name}
            </p>
          </div>`
      : ""
    }
      <h3 class="text-center text-lg font-bold">
        Шиномонтаж
      </h3>
      <div class="flex justify-between text-xs mb-1 pb-2 border-b-2 border-black">
        <p>Номер заказа:</p>
        <p class="text-base">
          ${name.id_shinomontazhs ? `№ <b>${name.id_shinomontazhs}</b>` : ""}
        </p>
      </div>
      <div class="flex justify-between text-xs">
        <p>Дата:</p>
        <p>
          ${date}
        </p>
      </div>
      <div class="flex justify-between text-xs">
        <p>Время:</p>
        <p>
          ${time}
        </p>
      </div>
      <div class="flex justify-between text-xs">
        <p>Гос. номер:</p>
        <p>
          ${name.regnumber}
        </p>
      </div>
      <div class="flex justify-between text-xs mb-1">
       ${name.mark !== "н"
      ? `<p>Авто:</p>
        <p>
          ${name.mark} ${name.model !== "Прочее" ? name.model : ""}
        </p>`
      : ""
    }
      </div>
      <div
        class="mb-3 text-xs pb-3"
      >${thereAreGroups ? `<p>Услуги (группа 1):</p>
        <div class="flex flex-col text-right">
          ${preorderGroup(1)}
        </div>
        <p>Услуги (группа 2):</p>
        <div class="flex flex-col text-right">
          ${preorderGroup(2)}
        </div>`
      : `<p>Услуги:</p>
        <div class="flex flex-col text-right">
          ${preorder}
        </div>`
    }

        <div class="flex justify-between w-full text-xs my-1">
          <p>Сумма:</p>
          <p>
            ${name.totalSumWithoutMaterials} р.
          </p>
       </div>

       ${thereAreGroups ? `<p>Материалы (группа 1):</p>
        <div class="flex flex-col text-right">
          ${materialGroup(1)}
        </div>
        <p>Материалы (группа 2):</p>
        <div class="flex flex-col text-right">
          ${materialGroup(2)}
        </div>`
      : `<p>Материалы:</p>
        <div class="flex flex-col text-right">
          ${material}
        </div>`
    }

        <div class="flex justify-between w-full text-xs my-1">
          <p>Сумма:</p>
          <p>
            ${name.totalMaterial} р.
          </p>
       </div>

       <div class="flex justify-between w-full text-xs">
       <p>Общая сумма:</p>
       <p>
         ${name.totalSumm} р.
       </p>
    </div>
    ${name.discount ||
      name.services.filter((it) => it.free === "yes").length > 0
      ? `
        <div class="flex justify-between w-full text-xs">
          <p>Общая сумма:</p>
          <p>${name.totalSumm} р.</p>
        </div>
      `
      : `
        <div class="flex justify-between w-full text-xs">
          <p class="font-bold">Общая сумма:</p>
          <p class="font-bold">${name.totalSumm} р.</p>
        </div>
      `
    }
    ${name.discount
      ? `<div class="flex justify-between w-full text-xs">
          <p class="font-bold">Скидка:</p>
          <p class="font-bold">${name.discount}%</p>
        </div>`
      : ""
    }
    ${!name.discount &&
      name.services.filter((it) => it.free === "yes").length > 0
      ? `
        <div class="flex justify-between w-full text-xs">
          <p class="font-bold">Скидка:</p>
          <p class="font-bold">Акция</p>
        </div>
      `
      : ""
    }
     ${name.discount ||
      name.services.filter((it) => it.free === "yes").length > 0
      ? `<div class="flex justify-between w-full text-xs">
           <p class="font-bold">Сумма со скидкой:</p>
           <p class="font-bold">${name.totalWithDiscount} р.</p>
         </div>`
      : ""
    }
  ${name.tyre.find((it) => it?.brand)
      ? `<div class="mt-1">
        <p class="text-left">Установленные шины:</p>
        <p class="text-right">
        ${name.tyre[0].sizeone} 
        ${name.tyre[0].sizetwo} ${name.diametr}  ${name.tyre[0].brand} ${name.tyre[0].model}
        </p>
      </div>`
      : ""
    }
  ${name.comment
      ? `<div class="flex justify-between w-full text-xs">
        <p class="font-bold">Комментарий:</p>
        <p class="font-bold">${name.comment}</p>
      </div>`
      : ""
    }
      </div>
      <p class="text-left text-xs mt-1">Не является фискальным чеком</p>
      <h2 class="text-center text-lg mt-1 font-bold">Всегда рады вам!</h2>
    </div></body>`;
  fs.writeFile(app.getPath("userData") + "/shinomontazh.html", check, (err) => {
    if (err) {
      console.log("Error writing shinomontazh html", err);
    } else {
      console.log("Successfully wrote shinomontazh html");
    }
  });
};

module.exports = shinoPrint;
