export class ListTemplate {
    constructor(container) {
        this.container = container;
    }
    render(item, index, length) {
        const li = document.createElement('li');
        li.classList.add('todo-item');
        if (item.completed) {
            li.classList.add('completed');
        }
        li.setAttribute('data-array-index', index);
        li.style.animationDuration = `${(1 / length) * parseInt(index)}s`;
        li.innerHTML = item.format();
        this.container.appendChild(li);
    }
    display(tasks) {
        const length = tasks.length;
        this.clear();
        let uncompletedTask = 0;
        if (length) {
            tasks.forEach((task, index) => {
                this.render(task, index.toString(), length);
                if (!task.completed) {
                    uncompletedTask++;
                }
            });
        }
        else {
            this.container.innerHTML = '<strong class="todo-item">No Task Found.</strong>';
        }
        if (navigator.setAppBadge) {
            navigator.setAppBadge(uncompletedTask);
        }
        else if (navigator.setExperimentalAppBadge) {
            navigator.setExperimentalAppBadge(uncompletedTask);
        }
        if (length > 1000) {
            alert("Hey User , You can Delete unnecessary Todos for smooth use.");
        }
    }
    clear() {
        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
        if (navigator.clearAppBadge) {
            navigator.clearAppBadge();
        }
        else if (navigator.clearExperimentalAppBadge) {
            navigator.clearExperimentalAppBadge();
        }
    }
}
