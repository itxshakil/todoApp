export class Task {
    constructor(readonly task: string, public completed: boolean = false) {}

    toggleCompleted() {
        this.completed = !this.completed;
    }

    isLink() {
        return this.task.indexOf('http') === 0;
    }

    format(key:String) {
        return `<label for="task-${key}" data-link="${this.isLink()}">${this.task}</label>
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