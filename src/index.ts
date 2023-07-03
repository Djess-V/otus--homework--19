import { Router, IArgs } from "@djess-v/router";
import FuzzySearch from "fuzzy-search";
import { App } from "./components/App";
import "./style/style.scss";
import { Start } from "./components/pages/Start";
import { Calendar } from "./components/pages/Calendar";
import { Tasks } from "./components/pages/Tasks";
import { About } from "./components/modals/About";
import { IDateInfo, getTheDate } from "./service/functions";
import { RootState, store } from "./store/store";
import { LocalStorage } from "./api/LocalStorage";
import { unloadTasksFromLS } from "./slices/sliceTask";
import { Header } from "./components/pages/Header";

const storage = new LocalStorage("@djess-v/my-calendar");

loadInitialDataIntoStore();

const now = new Date();

const { month, year, day } = getTheDate(now);

const element = document.getElementById("app") as HTMLDivElement;

new App(element);

let homeLink = "/";

if (PRODUCTION) {
  homeLink = PREFIX + homeLink;
}

const header = element.querySelector(".header") as HTMLElement;
const main = element.querySelector(".main") as HTMLElement;
const about = element.querySelector(".about") as HTMLElement;

const router = new Router();

router.on(homeLink, {
  onEnter: handleEnterForHome,
});
router.on(/\/calendar(.+)?/, {
  onEnter: handleEnterForCalendar(),
});
router.on(/\/tasks(.+)?/, {
  onEnter: handleEnterForTasks(),
});
router.on(/\/about/, {
  onEnter: () => {
    new Header(header, { link: "about", month, year, day });
    new About(about);
  },
  onLeave: (...args) => {
    about.innerHTML = "";
  },
});

function handleEnterForHome() {
  new Header(header, { month, year, day });
  new Start(main);

  if (PRODUCTION) {
    element.querySelectorAll("a").forEach((link) => {
      link.href = PREFIX + link.pathname + link.search;
    });
  }
}

function handleEnterForCalendar() {
  return (...args: IArgs[]) => {
    let dateInfo: IDateInfo = getTheDate(now);
    let completed = false;
    let { tasks } = <RootState>store.getState();

    if ("month" in args[0].state && "year" in args[0].state) {
      dateInfo = getTheDate(now, args[0].state);
    }

    if ("completed" in args[0].state) {
      completed = Boolean(Number(args[0].state.completed));
    }

    if (completed) {
      tasks = tasks.filter((task) => task.status);
    }

    new Header(header, { link: "calendar", month, year, day });
    new Calendar(main, { now, dateInfo, completed, tasks });

    if (PRODUCTION) {
      element.querySelectorAll("a").forEach((link) => {
        link.href = PREFIX + link.pathname + link.search;
      });
    }
  };
}

function handleEnterForTasks() {
  return (...args: IArgs[]) => {
    let dateInfo: IDateInfo;
    let showAll = false;
    let search = "";
    let completed = false;
    let { tasks } = <RootState>store.getState();

    if ("all" in args[0].state) {
      showAll = Boolean(Number(args[0].state.all));
    }

    if ("search" in args[0].state) {
      ({ search } = args[0].state);
    }

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

    if (!showAll) {
      tasks = tasks.filter((task) => {
        const taskDate = new Date(task.dateOfExecution);

        return (
          dateInfo.year === taskDate.getFullYear() &&
          dateInfo.month === taskDate.getMonth() &&
          dateInfo.day === taskDate.getDate()
        );
      });
    }

    if (completed) {
      tasks = tasks.filter((task) => task.status);
    }

    if (search) {
      const searcher = new FuzzySearch(tasks, ["text"]);

      tasks = searcher.search(search);
    }

    new Header(header, { link: "tasks", showAll, month, year, day });
    new Tasks(main, {
      tasks,
      storage,
      dateInfo,
      now,
      completed,
      showAll,
      reloadUrl,
      search,
    });

    if (PRODUCTION) {
      element.querySelectorAll("a").forEach((link) => {
        link.href = PREFIX + link.pathname + link.search;
      });
    }
  };
}

async function loadInitialDataIntoStore() {
  await storage.createStorage();

  const defaultTask = await storage.fetchAll();

  store.dispatch(unloadTasksFromLS(defaultTask));
  await reloadUrl();
}

function reloadUrl(search = "") {
  if (search && window.location.href.includes(search)) {
    return;
  }
  window.history.pushState(
    {},
    `${window.location.href}${search}`,
    `${window.location.href}${search}`
  );
}
