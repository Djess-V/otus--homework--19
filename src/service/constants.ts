export const daysOfTheWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const months = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

export type IValue = "asc" | "desc";

export interface IFilterObj {
  id: string;
  title: string;
  subTitle1: {
    text: string;
    value: IValue;
  };
  subTitle2: {
    text: string;
    value: IValue;
  };
}

export type IFilterData = IFilterObj[];

export const filterData: IFilterData = [
  {
    id: "text",
    title: "Alphabet",
    subTitle1: { text: "from A to Z", value: "asc" },
    subTitle2: { text: "from Z to A", value: "desc" },
  },
  {
    id: "createdAt",
    title: "By date",
    subTitle1: { text: "new", value: "desc" },
    subTitle2: { text: "old", value: "asc" },
  },
  {
    id: "status",
    title: "By status",
    subTitle1: { text: "done", value: "desc" },
    subTitle2: { text: "unfilled", value: "asc" },
  },
  {
    id: "tags",
    title: "By tags",
    subTitle1: { text: "Enter tags", value: "asc" },
    subTitle2: { text: "", value: "desc" },
  },
];
