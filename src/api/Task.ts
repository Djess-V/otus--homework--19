import { v4 } from "uuid";

export interface ITask {
  id: string;
  text: string;
  status: boolean;
  createdAt: string;
  tags: string[];
}

export function getNewTask(text: string, tags: string): ITask {
  return {
    id: v4(),
    text: text.replace(/[<>]/gi, ""),
    tags: tags.split(",").map((tag) => tag.trim().toLowerCase()),
    status: false,
    createdAt: new Date().toISOString(),
  };
}
