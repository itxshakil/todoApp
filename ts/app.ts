import { TaskManager } from "./classes/TaskManager.js";
import { Task } from "./classes/Task.js";
import { ListTemplate } from "./classes/ListTemplate.js";

const ul = document.querySelector("#tasks-list") as HTMLUListElement;
const addForm = document.forms[1];
const search = document.querySelector("#search") as HTMLInputElement;
const clearButton = document.querySelector("button#clearCompleted") as HTMLButtonElement;
const markAsCompletedButton = document.querySelector("button#markAsCompleted") as HTMLButtonElement;

const taskManager = new TaskManager();
const listRenderer = new ListTemplate(ul);

addForm.addEventListener("submit", event => {
    event.preventDefault();

    const input = addForm.querySelector("input") as HTMLInputElement;
    if (input.value == "") {
        alert("Please Enter Text");
        return;
    }
    const tasks = taskManager.addTask(new Task(input.value));
    listRenderer.display(tasks);
    showHideAdditionalButtons();

    input.value = "";
});

ul.addEventListener("dblclick", event => {
    const target = event.target as HTMLLIElement;
    if (target.tagName == "LI") {
        const link = target.querySelector("label[data-link=true]") as HTMLLabelElement;
        if (link) {
            const url = link.dataset?.url || link.innerText;
            window.open(url);
        }
    }
});

ul.addEventListener("click", event => {
    const target = event.target as HTMLElement;

    if (target.tagName.toUpperCase() === "INPUT") {
        const checkbox = target as HTMLInputElement;
        const div = checkbox.parentNode as HTMLDivElement;
        const list = div.parentNode as HTMLLIElement;

        const index = parseInt(list.dataset.arrayIndex!);
        taskManager.toggleTaskStatus(index);
        showHideAdditionalButtons();
        if (checkbox.checked) {
            list.classList.add("completed");
        } else {
            list.classList.remove("completed");
        }
    };

    if (target.classList.contains("del-btn") && confirm("Are you sure to Delete?")) {
        const delBtnDiv = target.parentNode as HTMLDivElement;
        const list = delBtnDiv.parentNode as HTMLLIElement;
        const index = parseInt(list.dataset.arrayIndex!);

        const tasks = taskManager.removeTask(index);
        listRenderer.display(tasks);
        showHideAdditionalButtons();
    }
})

search.addEventListener("keyup", event => {
    const inputBox = event.target as HTMLInputElement;
    const searchValue = inputBox.value.toLowerCase();
    if (searchValue) {
        document.querySelector('body')?.classList.add('search');
    } else {
        document.querySelector('body')?.classList.remove('search');
    }
    const lists = document.getElementsByTagName("li") as HTMLCollection;

    Array.from(lists).forEach(item => {
        const taskContainer = item.firstChild as HTMLDivElement;
        const task = taskContainer.textContent!;

        if (task.toLowerCase().includes(searchValue)) {
            item.classList.remove("hidden");
        } else {
            item.classList.add("hidden");
        }
    })
});

markAsCompletedButton.addEventListener("click", () => {
    const tasks = taskManager.markAllAsCompleted();
    listRenderer.display(tasks);
    showHideAdditionalButtons();
})

clearButton.addEventListener("click", () => {
    const tasks = taskManager.clearCompleted();
    listRenderer.display(tasks);
    showHideAdditionalButtons();
})

function showHideAdditionalButtons() {
    const totalTasks = taskManager.getTasksCount();
    const completedTasks = taskManager.getCompletedTaskCount();

    clearButton.style.visibility = completedTasks > 0 ? "visible" : "hidden";

    if (totalTasks > 0) {
        markAsCompletedButton.style.visibility = completedTasks == totalTasks ? "hidden" : "visible";
    } else {
        markAsCompletedButton.style.visibility = "hidden";
    }
}
document.addEventListener("DOMContentLoaded", () => {
    listRenderer.display(taskManager.getTodos());
    showHideAdditionalButtons();
});