import { Task } from "./Task.js";
import { Storage } from "./Storage.js";
export class TaskManager {
    constructor() {
        this.tasks = [];
    }
    addTask(task) {
        this.getTodos();
        this.tasks.push(task);
        return this.saveTasks();
    }
    getTodos() {
        let storageItem = Storage.getItem("todos");
        this.tasks = storageItem ? this.castAsTask(storageItem) : this.tasks;
        return this.tasks;
    }
    removeTask(index) {
        this.getTodos();
        this.tasks.splice(index, 1);
        return this.saveTasks();
    }
    castAsTask(tasks) {
        let todos = [];
        tasks.forEach(task => {
            todos.push(new Task(task.task, task.completed));
        });
        return todos;
    }
    toggleTaskStatus(index, status) {
        this.getTodos();
        if (status === undefined) {
            this.tasks[index].toggleCompleted();
        }
        else {
            this.tasks[index].completed = status;
        }
        this.saveTasks();
    }
    markAllAsCompleted() {
        this.getTodos();
        this.tasks.forEach(function (item) {
            item.completed = true;
        });
        return this.saveTasks();
    }
    clearCompleted() {
        this.getTodos();
        this.tasks = this.tasks.filter(task => {
            return task.completed == false;
        });
        return this.saveTasks();
    }
    saveTasks() {
        Storage.addItem(this.tasks, "todos");
        return this.tasks;
    }
}
