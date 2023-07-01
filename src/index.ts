import { Router, IArgs } from "@djess-v/router";
import EventBus from "js-event-bus";
import { App } from "./components/App";
import "./style/style.scss";
import { Start } from "./components/pages/Start";
import { Calendar } from "./components/pages/Calendar";
import { Tasks } from "./components/pages/Tasks";
import { About } from "./components/modals/About";
import { IDateInfo, getTheDate } from "./service/functions";
import { store } from "./store/store";
import { loadInitialDataIntoStore } from "./api/loadInitialDataIntoStore";

loadInitialDataIntoStore();

const eventBus = new EventBus();

const { indexOfMonth, year } = getTheDate();

const element = document.getElementById("app") as HTMLDivElement;

new App(element, { indexOfMonth, year, eventBus });

let homeLink = "/";

if (PRODUCTION) {
  element.querySelectorAll("a").forEach((link) => {
    link.href = PREFIX + link.pathname + link.search;
  });
  homeLink = PREFIX + homeLink;
}

const main = element.querySelector(".main") as HTMLElement;
const about = element.querySelector(".about") as HTMLElement;

const router = new Router();

router.on(homeLink, {
  onEnter: () => {
    new Start(main);
  },
  onLeave: (...args) => {
    eventBus.emit("linking", null, args[0]);
  },
});
router.on(/\/calendar(.+)?/, {
  onEnter: handleEnterForCalendar(),
  onLeave: (...args) => {
    eventBus.emit("linking", null, args[0]);
  },
});
router.on(/\/tasks(.+)?/, {
  onEnter: () => {
    new Tasks(main, { tasks: store.getState().tasks });
  },
  onLeave: (...args) => {
    eventBus.emit("linking", null, args[0]);
  },
});
router.on(/\/about/, {
  onEnter: () => {
    new About(about);
  },
  onLeave: (...args) => {
    about.innerHTML = "";
    eventBus.emit("linking", null, args[0]);
  },
});

function handleEnterForCalendar() {
  return (...args: IArgs[]) => {
    let dateInfo: IDateInfo = getTheDate();

    if ("month" in args[0].state && "year" in args[0].state) {
      dateInfo = getTheDate(args[0].state);
    }

    new Calendar(main, dateInfo);

    if (PRODUCTION) {
      main.querySelectorAll("a").forEach((link) => {
        link.href = PREFIX + link.pathname + link.search;
      });
    }
  };
}
