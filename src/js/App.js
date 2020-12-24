import React, { useState } from "react";
import PrinterList from "../lists/printers.json";
import settings from "../lists/settings.json";
import places from "../lists/places.json";

export default function App() {
  const [state, setState] = useState({
    printer: settings.printer,
    printerbig: settings.printerbig,
    autoprintrazval: settings.autoprintrazval,
    autoprintrazvaltalon: settings.autoprintrazvaltalon,
    autoprintautopart: settings.autoprintautopart,
    autoprintshinomontazh: settings.autoprintshinomontazh,
    shinomontazhnumber: settings.shinomontazhnumber,
    place: settings.place,
    notifyrazval: settings.notifyrazval,
    notifyoil: settings.notifyoil,
    notifyautopart: settings.notifyautopart,
  });
  const [showSettings, setShowSetting] = useState(false);
  const onChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const checkboxChange = (e) => {
    const { name, checked } = e.target;
    if (checked) {
      setState((prevState) => ({
        ...prevState,
        [name]: true,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        [name]: false,
      }));
    }
  };
  const saveData = () => {
    electron.notificationApi.sendSettings(state);
  };
  return (
    <div className="m-3">
      {showSettings === false ? (
        <div>
          <h2 className="text-lg font-bold text-center">autodomcrm.ru</h2>
          <p>
            Система управления для печати заказов с сайта autodomcrm.ru. В
            настройках вы можете выбрать стандартный принтер для печати и
            указать что именно вам нужно печатать. Также присутствует настройка
            уведомлений о новых заказах.
          </p>
          <button
            className="my-3 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 hover:text-white rounded-lg"
            type="button"
            onClick={() => setShowSetting(true)}
          >
            Настройки
          </button>
        </div>
      ) : null}
      {showSettings !== false ? (
        <div>
          <div className="mb-5 w-full pr-3">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="place"
            >
              Выберите место работы
            </label>
            <div className="flex-shrink w-full inline-block relative mb-3">
              <select
                className="block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded"
                value={state.place}
                name="place"
                id="place"
                onChange={onChange}
              >
                <option value="" className="text-gray-800">
                  Выберете место работы
                </option>
                {places.map((it) => {
                  return (
                    <option value={it.id} key={it.id}>
                      {it.name}
                    </option>
                  );
                })}
              </select>
              <div className="pointer-events-none absolute top-0 mt-2  right-0 flex items-center px-2 text-gray-600">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="mb-5 w-full pr-3">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="printer"
            >
              Выберите принтер для чеков
            </label>
            <div className="flex-shrink w-full inline-block relative mb-3">
              <select
                className="block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded"
                value={state.printer}
                name="printer"
                id="printer"
                onChange={onChange}
              >
                <option value="" className="text-gray-800">
                  Выберете принтер
                </option>
                {PrinterList.map((it, index) => {
                  return (
                    <option value={it.name} key={index}>
                      {it.name}
                    </option>
                  );
                })}
              </select>
              <div className="pointer-events-none absolute top-0 mt-2  right-0 flex items-center px-2 text-gray-600">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="mb-5 w-full pr-3">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="printerbig"
            >
              Выберите принтер для печати А4
            </label>
            <div className="flex-shrink w-full inline-block relative mb-3">
              <select
                className="block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded"
                value={state.printerbig}
                name="printerbig"
                id="printerbig"
                onChange={onChange}
              >
                <option value="" className="text-gray-800">
                  Выберете принтер
                </option>
                {PrinterList.map((it, index) => {
                  return (
                    <option value={it.name} key={index}>
                      {it.name}
                    </option>
                  );
                })}
              </select>
              <div className="pointer-events-none absolute top-0 mt-2  right-0 flex items-center px-2 text-gray-600">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="mb-5 w-full pr-3">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="shinomontazhnumber"
            >
              Сколько распечатать талонов на шиномонтаж?
            </label>
            <div className="flex-shrink w-full inline-block relative mb-3">
              <input
                className="block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded"
                value={state.shinomontazhnumber}
                name="shinomontazhnumber"
                id="shinomontazhnumber"
                type="number"
                onChange={onChange}
              />
            </div>
          </div>

          <div className="w-full flex flex-row">
            <div className="w-1/2 mb-6 md:mb-0 flex flex-col">
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                Автопечать
              </label>
              <div className="mb-2">
                <label htmlFor="autoprintrazval">
                  <input
                    className="mr-2"
                    value={state.autoprintrazval}
                    name="autoprintrazval"
                    id="autoprintrazval"
                    defaultChecked={state.autoprintrazval}
                    onChange={checkboxChange}
                    type="checkbox"
                  />
                  Автопечать предчеков на развал-схождение
                </label>
              </div>
              <div className="mb-2">
                <label htmlFor="autoprintrazvaltalon">
                  <input
                    className="mr-2"
                    value={state.autoprintrazvaltalon}
                    defaultChecked={state.autoprintrazvaltalon}
                    name="autoprintrazvaltalon"
                    id="autoprintrazvaltalon"
                    onChange={checkboxChange}
                    type="checkbox"
                  />
                  Автопечать талонов на развал-схождение
                </label>
              </div>
              <div className="mb-2">
                <label htmlFor="autoprintautopart">
                  <input
                    className="mr-2"
                    value={state.autoprintautopart}
                    defaultChecked={state.autoprintautopart}
                    name="autoprintautopart"
                    id="autoprintautopart"
                    onChange={checkboxChange}
                    type="checkbox"
                  />
                  Автопечать предчков с автозапчастями
                </label>
              </div>
              <div className="mb-2">
                <label htmlFor="autoprintshinomontazh">
                  <input
                    className="mr-2"
                    value={state.autoprintshinomontazh}
                    defaultChecked={state.autoprintshinomontazh}
                    name="autoprintshinomontazh"
                    id="autoprintshinomontazh"
                    onChange={checkboxChange}
                    type="checkbox"
                  />
                  Автопечать талонов на шиномонтаж
                </label>
              </div>
            </div>
            <div className="w-1/2 mb-6 md:mb-0 flex flex-col">
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                Уведомления
              </label>
              <div className="mb-2">
                <label htmlFor="notifyrazval">
                  <input
                    className="mr-2"
                    value={state.notifyrazval}
                    name="notifyrazval"
                    id="notifyrazval"
                    defaultChecked={state.notifyrazval}
                    onChange={checkboxChange}
                    type="checkbox"
                  />
                  Развал-схождение - новые записи
                </label>
              </div>
              <div className="mb-2">
                <label htmlFor="notifyautopart">
                  <input
                    className="mr-2"
                    value={state.notifyautopart}
                    defaultChecked={state.notifyautopart}
                    name="notifyautopart"
                    id="notifyautopart"
                    onChange={checkboxChange}
                    type="checkbox"
                  />
                  Новые заказы автозапчастей
                </label>
              </div>
              <div className="mb-2">
                <label htmlFor="notifyoil">
                  <input
                    className="mr-2"
                    value={state.notifyoil}
                    defaultChecked={state.notifyoil}
                    name="notifyoil"
                    id="notifyoil"
                    onChange={checkboxChange}
                    type="checkbox"
                  />
                  Замена масла - новые записи
                </label>
              </div>
            </div>
          </div>
          <button
            className="my-3 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 hover:text-white rounded-lg"
            onClick={saveData}
            type="submit"
          >
            Сохранить
          </button>
          <button
            className="my-3 ml-2 px-4 py-2 bg-green-600 text-white hover:bg-green-700 hover:text-white rounded-lg"
            onClick={() => setShowSetting(false)}
            type="submit"
          >
            Закрыть настройки
          </button>
          <h1>I am App Component!!!</h1>
          <button
            onClick={() => {
              electron.notificationApi.sendNotification(
                "My custom notification!"
              );
            }}
          >
            Notify
          </button>
        </div>
      ) : null}
    </div>
  );
}
