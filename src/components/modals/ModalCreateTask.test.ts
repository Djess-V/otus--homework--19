import "jest-location-mock";
import { v4 } from "uuid";
import { LocalStorage } from "../../api/LocalStorage";
import { ModalCreateTask } from "./ModalCreateTask";

const sleep = (x: number) => new Promise((r) => setTimeout(r, x));

describe("ModalCreateTask", () => {
  let el: HTMLDivElement;

  const dateInfo = {
    firstNumberOfMonth: new Date(2023, 6, 1),
    month: 2023,
    year: 7,
    day: 5,
  };

  const prevPath =
    "https://github.com/tasks/update?year=2023&month=6&day=4&completed=1&id=1";

  const storage = new LocalStorage(v4());

  storage.createStorage();

  beforeEach(() => {
    el = document.createElement("div");
  });

  it("renders component instance to element and check button cancel", async () => {
    new ModalCreateTask(el, {
      storage,
      dateInfo,
      prevPath,
    });

    await sleep(100);

    const inputs = el.querySelectorAll("input") as NodeListOf<HTMLInputElement>;

    expect(inputs.length).toBe(4);

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
    new ModalCreateTask(el, {
      storage,
      dateInfo,
      prevPath,
    });

    await sleep(100);

    const link = el.querySelector(
      ".footer-content-modal__link"
    ) as HTMLAnchorElement;

    link.click = jest.fn();

    const input = el.querySelector(
      ".body-modal-create__input_type_create"
    ) as HTMLInputElement;

    input.value = "Bye";

    const form = el.querySelector(".body-modal-create") as HTMLFormElement;

    form.dispatchEvent(new Event("submit"));

    expect((await storage.fetchAll()).length).toBe(1);
  });

  it("renders component instance to element and check button create with non-correct datain field tags", async () => {
    new ModalCreateTask(el, {
      storage,
      dateInfo,
      prevPath,
    });

    await sleep(100);

    const link = el.querySelector(
      ".footer-content-modal__link"
    ) as HTMLAnchorElement;

    link.click = jest.fn();

    const tags = el.querySelector(
      ".body-modal-create__input_type_tags"
    ) as HTMLInputElement;

    tags.value = "bread-milk ";

    const form = el.querySelector(".body-modal-create") as HTMLFormElement;

    form.dispatchEvent(new Event("submit"));

    expect((await storage.fetchAll()).length).toBe(2);
  });
});
