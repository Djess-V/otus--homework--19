import _ from "lodash";
import { IDataToCreateTheDate, ITask, getNewTask } from "./Task";
import { IValue } from "../service/constants";

export class LocalStorage {
  dbName = "";

  tasks: ITask[] = [];

  static #instance: null | LocalStorage = null;

  constructor(dbName: string) {
    if (LocalStorage.#instance) {
      return LocalStorage.#instance;
    }
    this.dbName = dbName;
    LocalStorage.#instance = this;
  }

  createStorage = async (): Promise<ITask[]> => {
    this.tasks = await this.readFromStorage();

    if (this.tasks.length === 0) {
      const now = new Date();

      const dataToCreateTheDate: IDataToCreateTheDate = {
        year: now.getFullYear(),
        month: now.getMonth(),
        day: now.getDate(),
        hours: now.getHours(),
        minutes: now.getMinutes(),
      };

      this.tasks.push(getNewTask("First task", "task", dataToCreateTheDate));

      this.saveInStorage(this.tasks);
    }
    return this.tasks;
  };

  fetchAll = async (): Promise<ITask[]> => {
    this.tasks = await this.readFromStorage();
    return this.tasks;
  };

  search = async (text: string): Promise<ITask[]> => {
    this.tasks = await this.readFromStorage();

    this.tasks = this.tasks.filter((task) =>
      task.text.toLowerCase().includes(text)
    );

    return this.tasks;
  };

  createTask = async (task: ITask): Promise<ITask[]> => {
    this.tasks = await this.readFromStorage();

    this.tasks.push(task);

    await this.saveInStorage(this.tasks);

    return this.tasks;
  };

  delete = async (id: string): Promise<ITask[]> => {
    this.tasks = await this.readFromStorage();

    this.tasks = this.tasks.filter((task) => task.id !== id);

    await this.saveInStorage(this.tasks);

    return this.tasks;
  };

  update = async (
    id: string,
    text?: string,
    status?: boolean
  ): Promise<ITask[]> => {
    this.tasks = await this.readFromStorage();

    this.tasks = this.tasks.map((task) => {
      if (task.id === id) {
        if (text) {
          task.text = text.replace(/[<>]/gi, "");
        }

        if (status || status === false) {
          task.status = status;
        }
      }

      return task;
    });

    await this.saveInStorage(this.tasks);

    return this.tasks;
  };

  sortBy = async (param1: string, param2: string): Promise<ITask[]> => {
    this.tasks = await this.readFromStorage();

    if (param1 !== "tags") {
      this.tasks = _.orderBy(this.tasks, param1, param2 as IValue);
    } else {
      const tags = param2
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter((tag) => tag !== "");

      this.tasks = this.tasks.sort((a, b) => {
        const counTagsA = a.tags.reduce(
          (acc, cur) => (tags.includes(cur) ? 1 : 0) + acc,
          0
        );
        const counTagsB = b.tags.reduce(
          (acc, cur) => (tags.includes(cur) ? 1 : 0) + acc,
          0
        );

        if (counTagsA < counTagsB) {
          return 1;
        }
        if (counTagsA > counTagsB) {
          return -1;
        }
        return 0;
      });
    }

    return this.tasks;
  };

  private async saveInStorage(tasks: ITask[]): Promise<void> {
    localStorage.setItem(this.dbName, JSON.stringify(tasks));
  }

  private readFromStorage = async (): Promise<ITask[]> => {
    try {
      const items = localStorage.getItem(this.dbName);

      if (items) {
        return JSON.parse(items);
      }

      return [];
    } catch (e) {
      return [];
    }
  };
}
