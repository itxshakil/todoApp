export class Task {
    constructor(task, completed = false) {
        this.task = task;
        this.completed = completed;
    }
    toggleCompleted() {
        this.completed = !this.completed;
    }
    format() {
        return `<div>${this.task}</div>
                <div class="right">
                    <input type="checkbox" ${this.completed ? "checked" : ""} />
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
