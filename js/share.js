var _a;
import { TaskManager } from "./classes/TaskManager.js";
import { Task } from "./classes/Task.js";
const taskManager = new TaskManager();
if (window.location.protocol === 'http:') {
    const link = document.createElement('a');
    link.href = window.location.href.replace('http://', 'https://');
    (_a = document.querySelector('body')) === null || _a === void 0 ? void 0 : _a.appendChild(link);
    link.click();
}
let location = window.location;
const parsedUrl = new URL(location);
let url = parsedUrl.searchParams.get("url") || "";
let text = parsedUrl.searchParams.get("text") || "";
taskManager.addTask(new Task(`${text} ${url}`));
taskManager.addTask(new Task(`${text} ${url}`));
window.location.replace(`${location.origin}/`);
//# sourceMappingURL=share.js.map