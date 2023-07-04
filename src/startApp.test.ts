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

    const header = el.querySelector(".header") as HTMLElement;
    const main = el.querySelector(".main") as HTMLElement;
    const modals = el.querySelector(".modals") as HTMLElement;

    expect(header).toBeTruthy();
    expect(main).toBeTruthy();
    expect(modals).toBeTruthy();
  });

  it("check About", async () => {
    await startApp(el);

    const navHeader = el.querySelector(".nav-header") as HTMLElement;

    const links = navHeader.querySelectorAll(
      ".nav-header__link"
    ) as NodeListOf<HTMLAnchorElement>;

    links[2].click();

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
  });
});
