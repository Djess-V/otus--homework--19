import Component from "./basic/Component";

export class App extends Component {
  constructor(...props: [el: HTMLElement, initialState?: Record<string, any>]) {
    super(...props);

    this.state.eventBus.once("initialLoad", () => {
      this.setState({});
    });
  }

  render() {
    return `
    <header class="header" ></header>
    <main class="main _container" ></main>    
  `;
  }
}
