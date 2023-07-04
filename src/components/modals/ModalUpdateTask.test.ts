import "jest-location-mock";
import { LocalStorage } from "../../api/LocalStorage";
import { ModalUpdateTask } from "./ModalUpdateTask";

const sleep = (x: number) => new Promise((r) => setTimeout(r, x));

describe("ModalUpdateTask", () => {
  let el: HTMLDivElement;

  const task = {
    id: "1",
    text: "string",
    status: true,
    dateOfExecution: new Date().toISOString(),
    tags: ["Hello"],
  };

  const prevPath =
    "https://github.com/tasks/update?year=2023&month=6&day=4&completed=1&id=1";

  const storage = new LocalStorage("hell");

  storage.createStorage();

  storage.createTask(task);

  beforeEach(() => {
    el = document.createElement("div");
  });

  it("renders component instance to element and check button cancel", async () => {
    new ModalUpdateTask(el, {
      storage,
      id: task.id,
      text: task.text,
      prevPath,
    });

    await sleep(100);

    const input = el.querySelector(
      ".body-modal-update__input"
    ) as HTMLInputElement;

    expect(input.value).toBe(task.text);

    const link = el.querySelector(
      ".footer-content-modal__link"
    ) as HTMLAnchorElement;

    link.click = jest.fn();

    const cancel = el.querySelector(
      ".footer-content-modal__button-cancel"
    ) as HTMLButtonElement;

    cancel.click();

    await sleep(100);

    expect(link.click).toHaveBeenCalled();
  });

  it("renders component instance to element and check button create with data", async () => {
    new ModalUpdateTask(el, {
      storage,
      id: task.id,
      text: task.text,
      prevPath,
    });

    await sleep(100);

    const link = el.querySelector(
      ".footer-content-modal__link"
    ) as HTMLAnchorElement;

    link.click = jest.fn();

    const input = el.querySelector(
      ".body-modal-update__input"
    ) as HTMLInputElement;

    input.value = "Bye";

    const update = el.querySelector(
      ".footer-content-modal__button-update"
    ) as HTMLButtonElement;

    update.click();

    await sleep(100);

    expect((await storage.fetchAll())[0].text).toBe("Bye");
  });
});
