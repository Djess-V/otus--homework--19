import { App } from "./App";
import Component from "./basic/Component";

const sleep = (x: number) => new Promise((r) => setTimeout(r, x));

describe("App", () => {
  let el: HTMLElement;

  beforeEach(() => {
    el = document.createElement("div");
  });

  it("is a class", () => {
    expect(App).toBeInstanceOf(Function);

    const app = new App(el);

    expect(app).toBeInstanceOf(Component);
  });
});
