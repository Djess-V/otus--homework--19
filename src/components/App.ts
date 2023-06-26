import Component from "./basic/Component";

export class App extends Component {
  handlerClickLink = (e: Event) => {
    e.preventDefault();
  };

  events = {
    "click@link": this.handlerClickLink,
  };

  render() {
    return `<a class="link" href='#'>Проверка</a>`;
  }
}
