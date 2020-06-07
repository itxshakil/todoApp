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
    clear() {
        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
    }
}
