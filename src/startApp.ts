import { Router, IArgs } from "@djess-v/router";
import FuzzySearch from "fuzzy-search";
import EventBus from "js-event-bus";
import { App } from "./components/App";
import "./style/style.scss";
import { Start } from "./components/pages/Start";
import { Calendar } from "./components/pages/Calendar";
import { Tasks } from "./components/pages/Tasks";
import { About } from "./components/pages/About";
import { IDateInfo, getTheDate } from "./service/functions";
import { store } from "./store/store";
import { LocalStorage } from "./api/LocalStorage";
import { unloadTasksFromLS } from "./slices/sliceTask";
import { Header } from "./components/pages/Header";
import { ITask } from "./api/Task";
import { clearSearch } from "./slices/sliceSearch";

export default async function startApp(element: HTMLElement) {
  const storage = new LocalStorage("@djess-v/my-calendar");

  const eventBus = new EventBus();

  await loadInitialDataIntoStore();

  const now = new Date();

  const { month, year, day } = getTheDate(now);

  const router = new Router();

  router.on(/\/$/, {
    onEnter: (...args: IArgs[]) => {
      new App(element, { eventBus });

      const header = element.querySelector(".header") as HTMLElement;

      new Header(header, { month, year, day, eventBus });

      const main = element.querySelector(".main") as HTMLElement;

      new Start(main, { eventBus });

      addPrefix();
    },
    onLeave: () => {
      eventBus.detach("initialLoad");
    },
  });
  router.on(/\/calendar(.+)?/, {
    onEnter: (...args: IArgs[]) => {
      let dateInfo: IDateInfo = getTheDate(now);
      const { tasks, completed } = store.getState();

      if ("month" in args[0].state && "year" in args[0].state) {
        dateInfo = getTheDate(now, args[0].state);
      }

      new App(element, { eventBus });

      const header = element.querySelector(".header") as HTMLElement;

      new Header(header, {
        link: "calendar",
        month,
        year,
        eventBus,
      });

      addPrefix();

      const main = element.querySelector(".main") as HTMLElement;

      new Calendar(main, {
        now,
        dateInfo,
        completed,
        tasks,
        eventBus,
      });
    },
    onLeave: () => {
      eventBus.detach("initialLoad");
    },
  });
  router.on(/\/tasks(.+)?/, {
    onEnter: (...args: IArgs[]) => {
      let dateInfo: IDateInfo;
      let showAll = false;

      if ("all" in args[0].state) {
        showAll = Boolean(Number(args[0].state.all));
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

      new App(element, { eventBus });

      const header = element.querySelector(".header") as HTMLElement;

      new Header(header, {
        link: "tasks",
        showAll,
        month,
        year,
        eventBus,
      });

      addPrefix();

      const main = element.querySelector(".main") as HTMLElement;

      new Tasks(main, {
        dateInfo,
        storage,
        now,
        eventBus,
        showAll,
        searchTasks,
      });
    },
    onLeave: () => {
      eventBus.detach("initialLoad");
      store.dispatch(clearSearch());
    },
  });
  router.on(/\/about/, {
    onEnter: (...args: IArgs[]) => {
      new App(element, { eventBus });

      const header = element.querySelector(".header") as HTMLElement;

      new Header(header, {
        link: "about",
        month,
        year,
        eventBus,
      });

      const main = element.querySelector(".main") as HTMLElement;

      new About(main, { eventBus });
    },
    onLeave: () => {
      eventBus.detach("initialLoad");
    },
  });

  async function loadInitialDataIntoStore() {
    await storage.createStorage();

    const defaultTask = await storage.fetchAll();

    store.dispatch(unloadTasksFromLS(defaultTask));

    eventBus.emit("initialLoad");
  }

  function searchTasks(str: string, items: ITask[]) {
    let tasks = [...items];

    const searcher = new FuzzySearch(tasks, ["text"]);

    tasks = searcher.search(str);

    return tasks;
  }

  function addPrefix() {
    element.querySelectorAll("a").forEach((link) => {
      link.href = `/otus--homework--19${link.pathname}${link.search}`;
    });
  }
}
