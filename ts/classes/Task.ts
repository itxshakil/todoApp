export class Task {
    constructor(readonly task: string, public completed: boolean = false) {}

    toggleCompleted() {
        this.completed = !this.completed;
    }

    isLink() {
        let matches = this.task.match(/http(s)?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/);

        return matches?.length ? true : false;
    }

    getLink() {
        let matches = this.task.match(/http(s)?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/);

        return matches ? matches[0] : null;
    }

    format(key:String) {
        if(this.isLink()){
            return `<label for="task-${key}" data-url="${this.getLink()}" data-link="true">${this.task}</label>
                    <div class="right">
                        <input id="task-${key}" type="checkbox" ${this.completed ? "checked" : ""} />
                        <button class="del-btn">&times;</button>
                    </div>`;
        }
        return `<label for="task-${key}" data-link="false">${this.task}</label>
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