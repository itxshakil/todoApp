export class ListTemplate {
    constructor(container) {
        this.container = container;
    }
    render(item, index) {
        const li = document.createElement('li');
        li.classList.add('todo-item');
        if (item.completed) {
            li.classList.add('completed');
        }
        li.setAttribute('data-array-index', index);
        li.innerHTML = item.format();
        this.container.appendChild(li);
    }
    display(tasks) {
        const length = tasks.length;
        this.clear();
        if (length) {
            tasks.forEach((task, index) => {
                this.render(task, index.toString());
            });
        }
        else {
            this.container.innerHTML = '<strong class="todo-item">No Task Found.</strong>';
        }
        if (length > 1000) {
            alert("Hey User , You can Delete unnecessary Todos for smooth use.");
        }
    }
    clear() {
        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
    }
}
