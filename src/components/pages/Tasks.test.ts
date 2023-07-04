import "jest-location-mock";
import { LocalStorage } from "../../api/LocalStorage";
import { Tasks } from "./Tasks";

const sleep = (x: number) => new Promise((r) => setTimeout(r, x));

describe("Tasks", () => {
  let el: HTMLDivElement;

  const params = {
    tasks: [
      {
        id: "1",
        text: "string;",
        status: true,
        dateOfExecution: new Date().toISOString(),
        tags: ["Hello"],
      },
    ],
    dateInfo: {
      firstNumberOfMonth: new Date(2023, 6, 1),
      month: 2023,
      year: 7,
      day: 5,
    },
    completed: true,
    showAll: false,
    search: "",
    id: "",
  };

  const now = new Date();

  const path =
    "https://github.com/tasks/update?year=2023&month=6&day=4&completed=1&id=1";

  const storage = new LocalStorage("hello");

  storage.createStorage();

  beforeEach(() => {
    el = document.createElement("div");
  });

  it("renders component instance to element", async () => {
    new Tasks(el, {
      ...params,
      storage,
      now,
      path,
    });

    await sleep(100);

    const checkbox = el.querySelector(".tasks__checkbox") as HTMLElement;

    expect(checkbox).toBeTruthy();

    const status = el.querySelector(".status__input") as HTMLInputElement;

    status.dispatchEvent(new Event("click"));

    expect(status.checked).toBeTruthy();

    const btnDelete = el.querySelector(".delete__button") as HTMLButtonElement;

    btnDelete.dispatchEvent(new Event("click"));

    await sleep(100);

    let lis = el.querySelectorAll(".tasks__task") as NodeListOf<HTMLElement>;

    expect(lis.length).toBe(1);

    const link = el.querySelector(
      ".form-search-tasks__link"
    ) as HTMLAnchorElement;

    link.click = jest.fn();

    const input = el.querySelector(
      ".form-search-tasks__input"
    ) as HTMLInputElement;

    input.value = "Bye";

    const form = el.querySelector(".form-search-tasks") as HTMLFormElement;

    form.dispatchEvent(new Event("submit"));

    await sleep(100);

    lis = el.querySelectorAll(".tasks__task") as NodeListOf<HTMLElement>;

    expect(lis.length).toBe(1);
  });
});
