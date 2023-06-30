import Component from "./basic/Component";
import menu from "../assets/images/menu-bars.svg";
import { months } from "../service/constants";

export class App extends Component {
  handleClickLink = (e: Event) => {
    if ((<HTMLElement>e.target).tagName !== "A") {
      return;
    }

    if ((<HTMLElement>e.target).classList.contains("nav-header__link_active")) {
      return;
    }

    let links: NodeListOf<HTMLAnchorElement> | null = null;

    if ((<HTMLAnchorElement>e.target).dataset.id !== "/") {
      (<HTMLAnchorElement>e.target).classList.add("nav-header__link_active");
      links = (<HTMLElement>e.target).parentElement?.querySelectorAll(
        ".nav-header__link"
      ) as NodeListOf<HTMLAnchorElement>;
    } else {
      links = this.el.querySelectorAll(
        ".nav-header__link"
      ) as NodeListOf<HTMLAnchorElement>;
    }

    if (links) {
      links.forEach((link) => {
        if (link !== e.target) {
          link.classList.remove("nav-header__link_active");
        }
      });
    }
  };

  events = {
    "click@.nav-header": this.handleClickLink,
    "click@.header-container__title": this.handleClickLink,
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
