import { Task } from "./Task.js";
import { Storage } from "./Storage.js";

export class TaskManager {
    public tasks: Task[] = [];

    addTask(task: Task): Task[] {
        this.getTodos();

        this.tasks.push(task);

        return this.saveTasks();
    }

    getTodos(): Task[] {
        let storageItem = Storage.getItem("todos");
        this.tasks = storageItem ? this.castAsTask(storageItem) : this.tasks;

        return this.tasks;
    }

    removeTask(index: number): Task[] {
        this.getTodos();

        this.tasks.splice(index, 1);

        return this.saveTasks();
    }

    castAsTask(tasks: Task[]) {
        const todos: Task[] = []
        tasks.forEach(task => {
            todos.push(new Task(task.task, task.completed))
        });

        return todos;
    }

    toggleTaskStatus(index: number, status?: boolean) {
        this.getTodos();

        if (status === undefined) {
            this.tasks[index].toggleCompleted();
        } else {
            this.tasks[index].completed = status;
        }

        this.saveTasks();
    }

    markAllAsCompleted() {
        this.getTodos();
        this.tasks.forEach((item) => {
            item.completed = true;
        })

        return this.saveTasks();
    }

    clearCompleted() {
        this.getTodos();

        this.tasks = this.tasks.filter(task => {
            return task.completed == false;
        })

        return this.saveTasks();
    }

    saveTasks() {
        Storage.addItem(this.tasks, "todos");

        return this.tasks;
    }

    getTasksCount() {
        return this.tasks.length;
    }

    getCompletedTaskCount() {
        return this.tasks.filter(task => {
            return task.completed == true;
        }).length;
    }
}