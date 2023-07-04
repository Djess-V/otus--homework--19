import "jest-location-mock";
import startApp from "./startApp";

const sleep = (x: number) => new Promise((r) => setTimeout(r, x));

describe("startApp", () => {
  let el: HTMLElement;

  beforeEach(() => {
    el = document.createElement("div");
  });

  it("check render", async () => {
    await startApp(el);

    await sleep(100);

    const header = el.querySelector(".header") as HTMLElement;
    const main = el.querySelector(".main") as HTMLElement;
    const modals = el.querySelector(".modals") as HTMLElement;

    expect(header).toBeTruthy();
    expect(main).toBeTruthy();
    expect(modals).toBeTruthy();
  });

  it("check About", async () => {
    await startApp(el);

    await sleep(100);

    window.location.assign("/about");

    window.dispatchEvent(new Event("popstate"));

    await sleep(100);

    const footer = el.querySelector(".footer-modal-about") as HTMLElement;
    const desc = footer.querySelector("h3") as HTMLElement;

    const tds = el.querySelectorAll("td") as NodeListOf<HTMLTableCellElement>;
    const title = el.querySelector(
      ".content-modal__header_title"
    ) as HTMLElement;

    expect(desc.innerHTML).toBe("Description");
    expect(tds.length).toBe(6);
    expect(title.innerHTML).toBe("About");

    window.open = jest.fn();

    const github = el.querySelector(".github") as HTMLSpanElement;

    github.dispatchEvent(new Event("click"));

    expect(window.open).toHaveBeenCalled();
  });

  it("check Calendar", async () => {
    await startApp(el);

    await sleep(100);

    window.location.assign("/calendar");

    window.dispatchEvent(new Event("popstate"));

    await sleep(100);

    const tds = el.querySelectorAll("td") as NodeListOf<HTMLTableCellElement>;

    expect(tds.length).toBe(42);
  });

  it("check Tasks", async () => {
    await startApp(el);

    await sleep(100);

    window.location.assign("https://github.com/tasks?all=1completed=0");

    window.dispatchEvent(new Event("popstate"));

    await sleep(100);

    const checkbox = el.querySelector(".tasks__checkbox") as HTMLElement;

    expect(checkbox).toBeTruthy();
  });
});
