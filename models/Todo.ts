let id = 0;
export class Todo {
  id: number;
  text: string;
  iscomplete: boolean = false;

  constructor(text: string, iscomplete: boolean = false) {
    this.text = text;
    this.iscomplete = iscomplete;
    this.id = id++;
  }

  textLower = (): string => this.text.toLowerCase();
}
