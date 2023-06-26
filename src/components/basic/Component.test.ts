import Component from "./Component";

const sleep = (x: number) => new Promise((r) => setTimeout(r, x));

describe("Component", () => {
  let el: HTMLDivElement;
  beforeEach(() => {
    el = document.createElement("div");
  });

  it("is a class", () => {
    expect(Component).toBeInstanceOf(Function);
    class TestComponent extends Component {
      render() {
        return `
           <h1>Count ${this.state.toString()}</h1>
           <button class="dec">-</button>
           <button class="inc">+</button>
         `;
      }
    }
    expect(new TestComponent(el)).toBeInstanceOf(Component);
  });

  it("renders component instance to element", async () => {
    const text = String(Math.random());
    class TestComponent extends Component {
      render() {
        return `<h1>${text}</h1>${this.state.toString()}`;
      }
    }
    const test = new TestComponent(el);
    await sleep(10);

    expect(el.innerHTML).toBe(`<h1>${text}</h1>[object Object]`);
  });

  it("can render props from state", async () => {
    const text = String(Math.random());
    class TestComponent extends Component {
      state = {
        text,
      };

      render() {
        return `<h1>${this.state.text}</h1>`;
      }
    }
    const test = new TestComponent(el);
    await sleep(10);

    expect(el.innerHTML).toBe(`<h1>${text}</h1>`);
  });

  it("updates presentation on setState call", async () => {
    const text = String(Math.random());
    const text2 = String(Math.random());
    class TestComponent extends Component {
      state = {
        text,
        count: 1,
      };

      render() {
        return `<h1>${this.state.text}|${this.state.count}</h1>`;
      }
    }

    const component = new TestComponent(el);
    await sleep(10);

    expect(component.setState).toBeInstanceOf(Function);

    component.setState({
      text: text2,
    });

    expect(el.innerHTML).toBe(`<h1>${text2}|1</h1>`);
  });

  it("calls events from `.events` declaration", async () => {
    const onH1Click = jest.fn();
    const onButtonClick = jest.fn();
    const onButtonXClick = jest.fn();

    class TestComponent extends Component {
      onH1Click = onH1Click;

      onButtonClick = onButtonClick;

      onButtonXClick = onButtonXClick;

      events = {
        "click@h1": this.onH1Click,
        "click@button": this.onButtonClick,
        "click@button.x": this.onButtonXClick,
      };

      render() {
        return `
          <h1>0</h1>
          <button>1</button>
          <button class="x">2</button>
          ${this.state.toString()}
        `;
      }
    }
    const test = new TestComponent(el);
    await sleep(10);

    expect(onH1Click).not.toHaveBeenCalled();
    expect(onButtonClick).not.toHaveBeenCalled();
    expect(onButtonXClick).not.toHaveBeenCalled();

    const h1 = el.querySelector("h1") as HTMLElement;

    h1.dispatchEvent(
      new window.Event("click", {
        bubbles: true,
      })
    );

    expect(onH1Click).toHaveBeenCalledTimes(1);

    const btn = el.querySelector("button") as HTMLButtonElement;

    btn.click();

    expect(onButtonClick).toHaveBeenCalledTimes(1);

    const btnX = el.querySelector("button.x") as HTMLButtonElement;

    btnX.click();

    expect(onButtonClick).toHaveBeenCalledTimes(2);
    expect(onButtonXClick).toHaveBeenCalledTimes(1);
  });
});
