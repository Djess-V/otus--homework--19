import { IState } from "@djess-v/router";
import { months } from "./constants";

export interface IDateInfo {
  dateNow: Date;
  firstNumberOfMonth: Date;
  indexOfMonth: number;
  year: number;
}

export function getTheDate(state?: IState): IDateInfo {
  const dateNow = new Date();

  let firstNumberOfMonth: Date;
  let indexOfMonth: number;
  let year: number;

  if (state) {
    firstNumberOfMonth = new Date(
      Number(state.year),
      months.indexOf(state.month),
      1
    );

    indexOfMonth = months.indexOf(state.month);

    year = Number(state.year);
  } else {
    firstNumberOfMonth = new Date(dateNow.getFullYear(), dateNow.getMonth(), 1);

    indexOfMonth = dateNow.getMonth();

    year = dateNow.getFullYear();
  }

  return {
    dateNow,
    firstNumberOfMonth,
    indexOfMonth,
    year,
  };
}

export function addZero(number: number): string {
  if (number < 10) {
    return `0${String(number)}`;
  }

  return String(number);
}
