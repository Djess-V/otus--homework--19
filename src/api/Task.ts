import { v4 } from "uuid";

export class Task {
  id: string = v4();

  text: string;

  status = false;

  createdAt: Date = new Date();

  tags: string[];

  constructor(text: string, tags: string) {
    this.text = text.replace(/[<>]/gi, "");
    this.tags = tags.split(",").map((tag) => tag.trim().toLowerCase());
  }
}
