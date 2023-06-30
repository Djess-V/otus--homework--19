import { Router, IArgs } from "@djess-v/router";
import { App } from "./components/App";
import "./style/style.scss";
import { Start } from "./components/pages/Start";
import { Calendar } from "./components/pages/Calendar";
import { Tasks } from "./components/pages/Tasks";
import { About } from "./components/modals/About";
import { IDateInfo, getTheDate } from "./service/functions";
import { store } from "./store/store";

const { indexOfMonth, year } = getTheDate();

const element = document.getElementById("app") as HTMLDivElement;

new App(element, { indexOfMonth, year });

const main = element.querySelector(".main") as HTMLElement;
const about = element.querySelector(".about") as HTMLElement;

if (PRODUCTION) {
  element.querySelectorAll("a").forEach((link) => {
    link.href = PREFIX + link.href;
  });
}

new Start(main);

const router = new Router();

router.on("/", {
  onEnter: () => {
    new Start(main);
  },
  onLeave: handleLeaveForAll(),
});
router.on(/\/calendar(.+)?/, {
  onEnter: handleEnterForCalendar(),
  onLeave: handleLeaveForAll(),
});
router.on(/\/tasks(.+)?/, {
  onEnter: () => {
    new Tasks(main, { tasks: store.getState().tasks });
  },
  onLeave: handleLeaveForAll(),
});
router.on("/about", {
  onEnter: () => {
    new About(about);
  },
  onLeave: handleLeaveForAll(true),
});

function handleLeaveForAll(condition = false) {
  function removeModalAbout() {
    about.innerHTML = "";
  }

  return (...args: IArgs[]) => {
    const regExp = /(\/calendar)|(\/tasks)|(\/about)/;

    const currentRegExpExecArray = regExp.exec(args[0].currentPath);
    let currentMatch: string;

    if (!currentRegExpExecArray) {
      if (args[0].currentPath !== "/") {
        return;
      }

      currentMatch = args[0].currentPath;
    } else {
      currentMatch = currentRegExpExecArray[0];
    }

    if (!args[0].previousPath) {
      return;
    }

    const prevRegExpExecArray = regExp.exec(args[0].previousPath);
    let prevMatch: string;

    if (!prevRegExpExecArray) {
      if (args[0].previousPath !== "/") {
        return;
      }
      prevMatch = args[0].previousPath;
    } else {
      prevMatch = prevRegExpExecArray[0];
    }

    if (currentMatch === prevMatch) {
      return;
    }

    const currentLink = element.querySelector(
      `[data-id='${currentMatch}']`
    ) as HTMLAnchorElement;

    const prevLink = element.querySelector(
      `[data-id='${prevMatch}']`
    ) as HTMLAnchorElement;

    prevLink.classList.remove("nav-header__link_active");

    if (currentLink.dataset.id !== "/") {
      currentLink.classList.add("nav-header__link_active");
    }

    if (condition) {
      removeModalAbout();
    }
  };
}

function handleEnterForCalendar() {
  return (...args: IArgs[]) => {
    let dateInfo: IDateInfo = getTheDate();

    if ("month" in args[0].state && "year" in args[0].state) {
      dateInfo = getTheDate(args[0].state);
    }

    new Calendar(main, dateInfo);

    if (PRODUCTION) {
      element.querySelectorAll("a").forEach((link) => {
        link.href = PREFIX + link.href;
      });
    }
  };
}
