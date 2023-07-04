import _ from "lodash";
import { IDataToCreateTheDate, ITask, getNewTask } from "./Task";
import { addWithSort } from "../service/functions";

export class LocalStorage {
  dbName = "";

  tasks: ITask[] = [];

  constructor(dbName: string) {
    this.dbName = dbName;
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

  createTask = async (task: ITask): Promise<ITask[]> => {
    this.tasks = await this.readFromStorage();

    this.tasks = addWithSort(task, this.tasks);

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
