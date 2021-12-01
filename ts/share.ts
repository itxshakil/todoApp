import { TaskManager } from "./classes/TaskManager.js";
import { Task } from "./classes/Task.js";

const taskManager = new TaskManager();
/**
* Warn the page must be served over HTTPS
* The `beforeinstallprompt` event won't fire if the page is served over HTTP.
* Installability requires a service worker with a fetch event handler, and
* if the page isn't served over HTTPS, the service worker won't load.
*/
if (window.location.protocol === 'http:') {
    const link = document.createElement('a');
    link.href = window.location.href.replace('http://', 'https://');
    document.querySelector('body')?.appendChild(link);
    link.click();
}

let location: any = window.location;
const parsedUrl = new URL(location);
// let title = parsedUrl.searchParams.get("title") || "";
let url = parsedUrl.searchParams.get("url") || "";
let text = parsedUrl.searchParams.get("text") || "";

taskManager.addTask(new Task(`${text} ${url}`));
window.location.replace(`${location.origin}/`);
