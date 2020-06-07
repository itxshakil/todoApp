import { Task } from "./Task.js";

export class ListTemplate {
  constructor(private container: HTMLUListElement) { }

  render(item: Task, index: string) {
    const li = document.createElement('li');

    li.classList.add('todo-item');

    if (item.completed) {
      li.classList.add('completed');
    }

    li.setAttribute('data-array-index', index);

    li.innerHTML = item.format();

    this.container.appendChild(li);
  }

  clear() {
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
  }
}