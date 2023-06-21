import { TaskManager } from "./classes/TaskManager.js";
import { Task } from "./classes/Task.js";
import { ListTemplate } from "./classes/ListTemplate.js";

const taskLists = document.querySelector("#tasks-list") as HTMLUListElement;
const addForm = document.forms[1];
const search = document.querySelector("#search") as HTMLInputElement;
const clearButton = document.querySelector("button#clearCompleted") as HTMLButtonElement;
const markAsCompletedButton = document.querySelector("button#markAsCompleted") as HTMLButtonElement;

const taskManager = new TaskManager();
const listRenderer = new ListTemplate(taskLists);

addForm.addEventListener("submit", event => {
    event.preventDefault();

    const input = addForm.querySelector("input") as HTMLInputElement;
    if (input.value == "") {
        alert("Please enter a task");
        return;
    }
    const tasks = taskManager.addTask(new Task(input.value));
    listRenderer.display(tasks);
    showHideAdditionalButtons();

    if (!window.matchMedia('(display-mode: standalone)').matches) {
        showInstallSnackbar();
    } else if (Notification.permission !== 'granted' && Notification.permission !== 'denied' && tasks.length > 2) {
        showNotificationSnackbar();
    }
    input.value = "";
});

taskLists.addEventListener("dblclick", event => {
    const target = event.target as HTMLLIElement;
    if (target.tagName == "LI") {
        const link = target.querySelector("label[data-link=true]") as HTMLLabelElement;
        if (link) {
            const url = link.dataset?.url || link.innerText;
            window.open(url);
        }
    }
});

taskLists.addEventListener("click", event => {
    const target = event.target as HTMLElement;

    if (target.tagName.toUpperCase() === "INPUT") {
        const checkbox = target as HTMLInputElement;
        const div = checkbox.parentNode as HTMLDivElement;
        const list = div.parentNode as HTMLLIElement;

        const index = parseInt(list.dataset.arrayIndex!);
        taskManager.toggleTaskStatus(index);
        if (checkbox.checked) {
            list.classList.add("completed");
        } else {
            list.classList.remove("completed");
        }

        if (!window.matchMedia('(display-mode: standalone)').matches && !document.querySelector('.snackbar.show')) {
            showInstallSnackbar();
        }

        showHideAdditionalButtons();
    }

    if (target.classList.contains("del-btn") && confirm("Are you sure to Delete?")) {
        const delBtnDiv = target.parentNode as HTMLDivElement;
        const list = delBtnDiv.parentNode as HTMLLIElement;
        const index = parseInt(list.dataset.arrayIndex!);

        const tasks = taskManager.removeTask(index);
        listRenderer.display(tasks);
        showHideAdditionalButtons();
    }
})

taskLists.addEventListener("change", () => {
    showHideAdditionalButtons();
});

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
    if (!window.confirm("Are you sure to clear all completed tasks?")) {
        return;
    }

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

function showInstallSnackbar() {
    window.showSnackbar('install-snackbar');
}

window.showSnackbar = (snackBarId: string, delay: number = 3000, timeout = 10_000)=> {
    const activeSnackbar = document.querySelector('.snackbar.show');
    activeSnackbar?.classList.remove('show');

    const snackBar = document.getElementById(snackBarId);
    setTimeout(() => {
        snackBar?.classList.add('show');
        setTimeout(() => {
            snackBar?.remove();
        }, timeout)
    }, delay)
}

function showNotificationSnackbar() {
    window.showSnackbar('notification-snackbar');
}

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
});

window.showInstallPromotion = () => {
    deferredPrompt.prompt();
    deferredPrompt = null;
}

window.dismissSnackbar = () => {
    const activeSnackbar = document.querySelector('.snackbar.show');
    activeSnackbar?.classList.remove('show');
}

window.enableNotifications = async () => {
    const reg = await navigator.serviceWorker.getRegistration();

    if (!reg) {
        alert('No service worker registered');
        return;
    }

    if (Notification.permission !== 'granted') {
        try {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                alert('You need to allow push notifications.');
            }
        } catch (e) {
            console.log(e);
        }
    }
}
