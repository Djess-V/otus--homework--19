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
import { LocalStorage } from "./api/LocalStorage";
import { unloadTasksFromLS } from "./slices/sliceTask";

const storage = new LocalStorage("@djess-v/my-calendar");

loadInitialDataIntoStore();

const eventBus = new EventBus();

const { indexOfMonth, year, dateNow } = getTheDate();

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
  onBeforeEnter: (...args) => {
    eventBus.emit("linking", null, args[0]);
  },
});
router.on(/\/calendar(.+)?/, {
  onEnter: handleEnterForCalendar(),
  onBeforeEnter: (...args) => {
    eventBus.emit("linking", null, args[0]);
  },
});
router.on(/\/tasks(.+)?/, {
  onEnter: handleEnterForTasks(),
  onBeforeEnter: (...args) => {
    eventBus.emit("linking", null, args[0]);
  },
});
router.on(/\/about/, {
  onEnter: () => {
    new About(about);
  },
  onBeforeEnter: (...args) => {
    eventBus.emit("linking", null, args[0]);
  },
  onLeave: (...args) => {
    about.innerHTML = "";
  },
});

function handleEnterForCalendar() {
  return (...args: IArgs[]) => {
    let dateInfo: IDateInfo = getTheDate();

    if ("month" in args[0].state && "year" in args[0].state) {
      dateInfo = getTheDate(args[0].state);
    }

    new Calendar(main, { dateInfo, tasks: store.getState().tasks });

    if (PRODUCTION) {
      main.querySelectorAll("a").forEach((link) => {
        link.href = PREFIX + link.pathname + link.search;
      });
    }
  };
}

function handleEnterForTasks() {
  return (...args: IArgs[]) => {
    new Tasks(main, {
      tasks: store.getState().tasks,
      storage,
      dateInfo: args[0].state,
      dateNow,
    });
  };
}

async function loadInitialDataIntoStore() {
  await storage.createStorage();

  const defaultTask = await storage.fetchAll();

  store.dispatch(unloadTasksFromLS(defaultTask));
  router.go(window.location.href);
}
