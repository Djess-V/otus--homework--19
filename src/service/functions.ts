import { IState } from "@djess-v/router";
import { ITask } from "../api/Task";

export interface IDateInfo {
  firstNumberOfMonth: Date;
  month: number;
  year: number;
  day: number;
}

export function getTheDate(now: Date, state?: IState): IDateInfo {
  let firstNumberOfMonth: Date;
  let month: number;
  let year: number;
  let day: number;

  if (state) {
    firstNumberOfMonth = new Date(Number(state.year), Number(state.month), 1);

    month = Number(state.month);

    year = Number(state.year);

    day = Number(state.day);
  } else {
    firstNumberOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    month = now.getMonth();

    year = now.getFullYear();

    day = now.getDate();
  }

  return {
    firstNumberOfMonth,
    month,
    year,
    day,
  };
}

export function addZero(number: number): string {
  if (number < 10) {
    return `0${String(number)}`;
  }

  return String(number);
}

export function sort(arr: ITask[]) {
  const newArr = [...arr];
  const len = newArr.length;
  let max;
  let count;
  do {
    count = 0;
    for (let i = 0; i < len - 1; i += 1) {
      if (
        new Date(newArr[i].dateOfExecution).getTime() >
        new Date(newArr[i + 1].dateOfExecution).getTime()
      ) {
        count += 1;
        max = newArr[i];
        newArr[i] = newArr[i + 1];
        newArr[i + 1] = max;
      }
    }
  } while (count > 0);

  return newArr;
}

export function addWithSort(task: ITask, arr: ITask[]): ITask[] {
  const newArr = [...arr];
  let i = 0;
  let len = newArr.length;
  let h;
  let c = false;
  if (
    new Date(task.dateOfExecution).getTime() >
    new Date(newArr[len - 1].dateOfExecution).getTime()
  ) {
    newArr.push(task);
    return newArr;
  }
  if (
    new Date(task.dateOfExecution).getTime() <
    new Date(newArr[0].dateOfExecution).getTime()
  ) {
    newArr.splice(i, 0, task);
    return newArr;
  }
  while (c === false) {
    h = ~~((i + len) / 2);
    if (
      new Date(task.dateOfExecution).getTime() >
      new Date(newArr[h].dateOfExecution).getTime()
    ) {
      i = h;
    } else {
      len = h;
    }
    if (len - i <= 1) {
      newArr.splice(len, 0, task);
      c = true;
    }
  }

  return newArr;
}
