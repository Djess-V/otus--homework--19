import Component from "../basic/Component";

export class Header extends Component {
  render() {
    return `
      <div class="header__container header-container _container" >         
        <a class="header-container__title" href='/' >My Calendar</a>              
        <nav class="header-container__nav nav-header" >
          <a class="nav-header__link ${
            this.state.link === "calendar" ? "nav-header__link_active" : ""
          }" href='/calendar?year=${this.state.year}&month=${
      this.state.month
    }&completed=0' >CALENDAR</a>
          <a class="nav-header__link ${
            this.state.link === "tasks" && this.state.showAll
              ? "nav-header__link_active"
              : ""
          }" href='/tasks?all=1&completed=0' >ALL TASKS</a>
          <a class="nav-header__link ${
            this.state.link === "about" ? "nav-header__link_active" : ""
          }" href='/about' >ABOUT</a>          
        </nav>
      </div>
    `;
  }
}
