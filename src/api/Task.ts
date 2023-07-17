import { v4 } from "uuid";

export interface IDataToCreateTheDate {
  year: number;
  month: number;
  day: number;
  hours: number;
  minutes: number;
}

export interface ITask {
  id: string;
  text: string;
  status: boolean;
  dateOfExecution: string;
  tags: string[];
}

export function getNewTask(
  text: string,
  tags: string,
  dataToCreateTheDate: IDataToCreateTheDate
): ITask {
  return {
    id: v4(),
    text: text.replace(/[<>]/gi, ""),
    tags: tags.split(",").map((tag) => tag.trim().toLowerCase()),
    status: false,
    dateOfExecution: new Date(
      dataToCreateTheDate.year,
      dataToCreateTheDate.month,
      dataToCreateTheDate.day,
      dataToCreateTheDate.hours || 0,
      dataToCreateTheDate.minutes || 0
    ).toISOString(),
  };
}
