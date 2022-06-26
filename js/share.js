import { TaskManager } from "./classes/TaskManager.js";
import { Task } from "./classes/Task.js";
const taskManager = new TaskManager();
if (window.location.protocol === 'http:') {
    const link = document.createElement('a');
    link.href = window.location.href.replace('http://', 'https://');
    document.querySelector('body')?.appendChild(link);
    link.click();
}
const location = window.location;
const parsedUrl = new URL(location);
const url = parsedUrl.searchParams.get("url") || "";
const text = parsedUrl.searchParams.get("text") || "";
taskManager.addTask(new Task(`${text} ${url}`));
window.location.replace(`${location.origin}/`);
//# sourceMappingURL=share.js.map