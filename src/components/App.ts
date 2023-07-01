import { IArgs } from "@djess-v/router";
import Component from "./basic/Component";
import menu from "../assets/images/menu-bars.svg";
import { months } from "../service/constants";

export class App extends Component {
  constructor(
    ...props: [el: HTMLElement, initialState?: Partial<Record<string, any>>]
  ) {
    super(...props);
    this.state.eventBus.on("linking", (...args: IArgs[]) =>
      this.handleLinking(...args)
    );
  }

  handleLinking = (...args: IArgs[]) => {
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

    const currentLink = this.el.querySelector(
      `[data-id='${currentMatch}']`
    ) as HTMLAnchorElement;

    const prevLink = this.el.querySelector(
      `[data-id='${prevMatch}']`
    ) as HTMLAnchorElement;

    prevLink.classList.remove("nav-header__link_active");

    if (currentLink.dataset.id !== "/") {
      currentLink.classList.add("nav-header__link_active");
    }
  };

  render() {
    return `
    <header class="header" >
    <div class="header__container header-container _container" >         
        <a class="header-container__title" data-id="/" href='/' >My Calendar</a>              
        <nav class="header-container__nav nav-header" >
          <a class="nav-header__link" data-id="/calendar" href='/calendar?month=${
            months[this.state.indexOfMonth]
          }&year=${this.state.year}' >CALENDAR</a>
          <a class="nav-header__link" data-id="/tasks" href='/tasks' >TASKS</a>
          <a class="nav-header__link" data-id="/about" href='/about' >ABOUT</a>
          <img
          class="nav-header__nav-icon"
          src=${menu}
          alt="Nav-icon"
        />
        </nav>
      </div>
    </header>
    <main class="main _container" ></main>
    <section class="about" ></section>
  </div>`;
  }
}
