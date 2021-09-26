export class Task {
    constructor(readonly task: string, public completed: boolean = false) {}

    toggleCompleted() {
        this.completed = !this.completed;
    }

    format(key:String) {
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