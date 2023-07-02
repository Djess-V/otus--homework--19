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

const now = new Date();

const { month, year, day } = getTheDate(now);

const element = document.getElementById("app") as HTMLDivElement;

new App(element, { month, year, day, eventBus });

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
    let dateInfo: IDateInfo = getTheDate(now);
    let completed = false;
    let { tasks } = store.getState();

    if ("month" in args[0].state && "year" in args[0].state) {
      dateInfo = getTheDate(now, args[0].state);
    }

    if ("completed" in args[0].state) {
      completed = Boolean(Number(args[0].state.completed));
    }

    if (completed) {
      tasks = tasks.filter((task) => task.status);
    }

    new Calendar(main, { now, dateInfo, completed, tasks });

    if (PRODUCTION) {
      main.querySelectorAll("a").forEach((link) => {
        link.href = PREFIX + link.pathname + link.search;
      });
    }
  };
}

function handleEnterForTasks() {
  return (...args: IArgs[]) => {
    let dateInfo: IDateInfo;
    let completed = false;
    const { tasks } = store.getState();

    if (
      "month" in args[0].state &&
      "year" in args[0].state &&
      "day" in args[0].state
    ) {
      dateInfo = getTheDate(now, args[0].state);
    } else {
      dateInfo = getTheDate(now);
    }

    if ("completed" in args[0].state) {
      completed = Boolean(Number(args[0].state.completed));
    }

    new Tasks(main, {
      tasks,
      storage,
      dateInfo,
      now,
      completed,
    });
  };
}

async function loadInitialDataIntoStore() {
  await storage.createStorage();
  // localStorage.setItem("@djess-v/my-calendar", "[]");
  const defaultTask = await storage.fetchAll();

  store.dispatch(unloadTasksFromLS(defaultTask));
  router.go(window.location.href);
}
