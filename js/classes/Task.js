export class Task {
    constructor(task, completed = false) {
        this.task = task;
        this.completed = completed;
    }
    toggleCompleted() {
        this.completed = !this.completed;
    }
    format(key) {
        return `<label for="task-${key}">${this.task}</label>
                <div class="right">
                    <input id="task-${key}" type="checkbox" ${this.completed ? "checked" : ""} />
                    <button class="del-btn">&times;</button>
                </div>`;
    }
    newformat() {
        return `<div>${this.task}</div>
                <div class="right">
                    <input type="checkbox" ${this.completed ? "checked" : ""} />
                </div>`;
    }
}
