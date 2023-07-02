import { IState } from "@djess-v/router";

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
