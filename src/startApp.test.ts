import "jest-location-mock";
import startApp from "./startApp";

const sleep = (x: number) => new Promise((r) => setTimeout(r, x));

describe("startApp", () => {
  let el: HTMLElement;

  beforeEach(async () => {
    el = document.createElement("div");

    await startApp(el);
  });

  it("check render", () => {
    const header = el.querySelector(".header") as HTMLElement;
    const main = el.querySelector(".main") as HTMLElement;

    expect(header).toBeTruthy();
    expect(main).toBeTruthy();
  });

  it("check About", async () => {
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
    window.location.assign("/calendar");

    window.dispatchEvent(new Event("popstate"));

    await sleep(100);

    const tds = el.querySelectorAll("td") as NodeListOf<HTMLTableCellElement>;

    expect(tds.length).toBe(42);
  });

  it("check Tasks with all tasks", async () => {
    window.location.assign("/tasks?all=1");

    window.dispatchEvent(new Event("popstate"));

    await sleep(100);

    const checkbox = el.querySelector(
      ".checkbox-completed__input"
    ) as HTMLInputElement;

    checkbox.dispatchEvent(new Event("click"));

    expect(checkbox.checked).toBeFalsy();

    const lis = el.querySelectorAll("li") as NodeListOf<HTMLLIElement>;

    expect(lis.length).toBe(1);
  });

  it("check for creating, updating and search tasks on a specific date", async () => {
    window.location.assign("/tasks?year=2023&month=6&day=5");

    window.dispatchEvent(new Event("popstate"));

    await sleep(100);

    const btnCreate = el.querySelector(
      ".tasks__button-create-task"
    ) as HTMLButtonElement;

    btnCreate.dispatchEvent(new Event("click"));

    await sleep(100);

    const btnCancel = el.querySelector(
      ".footer-content-modal__button-cancel"
    ) as HTMLButtonElement;

    btnCancel.dispatchEvent(new Event("click"));

    await sleep(100);

    btnCreate.dispatchEvent(new Event("click"));

    await sleep(100);

    let inputText = el.querySelector(
      ".body-modal-create__input_type_create"
    ) as HTMLInputElement;

    inputText.value = "Bear";

    let form = el.querySelector(".body-modal-create") as HTMLButtonElement;

    form.dispatchEvent(new Event("submit"));

    await sleep(100);

    let lis = el.querySelectorAll("li") as NodeListOf<HTMLLIElement>;

    expect(lis.length).toBe(3);

    btnCreate.dispatchEvent(new Event("click"));

    await sleep(100);

    inputText = el.querySelector(
      ".body-modal-create__input_type_create"
    ) as HTMLInputElement;

    inputText.value = "Bear";

    const inputTags = el.querySelector(
      ".body-modal-create__input_type_tags"
    ) as HTMLInputElement;

    inputTags.value = "Bear-bear";

    form = el.querySelector(".body-modal-create") as HTMLButtonElement;

    form.dispatchEvent(new Event("submit"));

    await sleep(100);

    const message = el.querySelector(
      ".body-modal__error-message"
    ) as HTMLElement;

    expect(message).toBeTruthy();

    btnCancel.dispatchEvent(new Event("click"));

    await sleep(100);

    lis = el.querySelectorAll("li") as NodeListOf<HTMLLIElement>;

    const btnUpdate = lis[1].querySelector(
      ".update__button"
    ) as HTMLButtonElement;

    btnUpdate.dispatchEvent(new Event("click"));

    await sleep(100);

    const inputUpdate = el.querySelector(
      ".body-modal-update__input"
    ) as HTMLInputElement;

    expect(inputUpdate.value).toBe("Bear");

    inputUpdate.value = "Bear is good!";

    const update = el.querySelector(
      ".footer-content-modal__button-update"
    ) as HTMLButtonElement;

    update.dispatchEvent(new Event("click"));

    await sleep(100);

    lis = el.querySelectorAll("li") as NodeListOf<HTMLLIElement>;

    const taskText = lis[1].querySelector(".text-task") as HTMLElement;

    expect(taskText.textContent).toBe("Bear is good!");

    const inputSearch = el.querySelector(
      ".form-search-tasks__input"
    ) as HTMLInputElement;

    inputSearch.value = "Bear";

    const formSearch = el.querySelector(
      ".form-search-tasks"
    ) as HTMLFormElement;

    formSearch.dispatchEvent(new Event("submit"));

    await sleep(100);

    lis = el.querySelectorAll("li") as NodeListOf<HTMLLIElement>;

    expect(lis.length).toBe(2);
  });
});
