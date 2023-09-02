export class Task {
    task;
    completed;
    constructor(task, completed = false) {
        this.task = task;
        this.completed = completed;
    }
    toggleCompleted() {
        this.completed = !this.completed;
    }
    isLink() {
        const matches = this.task.match(/http(s)?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/);
        return matches?.length ? true : false;
    }
    getLink() {
        const matches = this.task.match(/http(s)?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/);
        return matches ? matches[0] : null;
    }
    format(key) {
        if (this.isLink()) {
            return `<input id="task-${key}" type="checkbox" ${this.completed ? "checked" : ""} />
                    <label for="task-${key}" data-url="${this.getLink()}" data-link="true">${this.task}</label>`;
        }
        return `<input id="task-${key}" type="checkbox" ${this.completed ? "checked" : ""} />
                <label for="task-${key}" data-link="false">${this.task}</label>`;
    }
    newformat() {
        return `<div>${this.task}</div>
                <div class="right">
                    <input type="checkbox" ${this.completed ? "checked" : ""} />
                </div>`;
    }
}
//# sourceMappingURL=Task.js.map