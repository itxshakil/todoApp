import { Task } from "./Task.js";

export class ListTemplate {
  constructor(private container: HTMLUListElement) { }

  render(item: Task, index: string, length: number) {
    const li = document.createElement('li');
    li.classList.add('todo-item');

    if (item.completed) {
      li.classList.add('completed');
    }

    li.setAttribute('data-array-index', index);
    li.style.animationDuration = `${(1 / length) * parseInt(index)}s`;

    li.innerHTML = item.format(index);

    this.container.appendChild(li);
  }

  display(tasks: Task[]) {
    this.clear();
    const uncompletedTask = this.showTasks(tasks);

    if (navigator.setAppBadge) {
      navigator.setAppBadge(uncompletedTask);
    } else if (navigator.setExperimentalAppBadge) {
      navigator.setExperimentalAppBadge(uncompletedTask);
    }

    if (length > 1000) {
      alert("Hey User , You can Delete unnecessary Todos for smooth use.");
    }
  }

  private showTasks(tasks: Task[]) {
    const length: number = tasks.length;
    let uncompletedTask = 0;

    if (length) {
      this.container.classList.remove('no-task');
    } else {
      this.container.innerHTML = '<li><strong class="todo-item">No tasks here yet.</strong><li>';
      this.container.classList.add('no-task');
    }

    tasks.forEach((task, index) => {
      this.render(task, index.toString(), length);
      if (!task.completed) {
        uncompletedTask++;
      }
    });

    return uncompletedTask;
  }

  clear() {
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }

    if (navigator.clearAppBadge) {
      navigator.clearAppBadge();
    } else if (navigator.clearExperimentalAppBadge) {
      navigator.clearExperimentalAppBadge();
    }
  }
}