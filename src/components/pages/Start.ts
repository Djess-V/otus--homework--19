import Component from "../basic/Component";

export class Start extends Component {
  constructor(...props: [el: HTMLElement, initialState?: Record<string, any>]) {
    super(...props);

    this.state.eventBus.once("initialLoad", () => {
      this.setState({});
    });
  }

  render() {
    return `
      <div class="welcome">
         <h1 >Welcome!</h1>
         <h2>Use the links at the top of the app for further work.</h2>
      </div>`;
  }
}
