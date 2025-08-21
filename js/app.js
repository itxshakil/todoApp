import { TaskManager } from "./classes/TaskManager.js";
import { Task } from "./classes/Task.js";
import { ListTemplate } from "./classes/ListTemplate.js";
const taskLists = document.querySelector("#tasks-list");
const addForm = document.forms[1];
const search = document.querySelector("#search");
const clearButton = document.querySelector("button#clearCompleted");
const markAsCompletedButton = document.querySelector("button#markAsCompleted");
const taskManager = new TaskManager();
const listRenderer = new ListTemplate(taskLists);
addForm.addEventListener("submit", event => {
    event.preventDefault();
    const input = addForm.querySelector("input");
    if (input.value == "") {
        alert("Please enter a task");
        return;
    }
    const tasks = taskManager.addTask(new Task(input.value));
    listRenderer.display(tasks);
    showHideAdditionalButtons();
    syncPendingSummaryWithSW();
    if (!isAppInstalled()) {
        if (tasks.length > 2) {
            showInstallSnackbar();
        }
    }
    else if (Notification.permission !== 'granted' && Notification.permission !== 'denied' && tasks.length > 4) {
        showNotificationSnackbar();
    }
    input.value = "";
});
function isAppInstalled() {
    if ('standalone' in navigator && navigator.standalone) {
        return true;
    }
    if (window.matchMedia('(display-mode: standalone)').matches) {
        return true;
    }
    return false;
}
taskLists.addEventListener("dblclick", event => {
    const target = event.target;
    if (target.tagName == "LI") {
        const link = target.querySelector("label[data-link=true]");
        if (link) {
            const url = link.dataset?.url || link.innerText;
            window.open(url);
        }
    }
});
taskLists.addEventListener("click", event => {
    const target = event.target;
    if (target.tagName.toUpperCase() === "INPUT") {
        const checkbox = target;
        const task = target.closest('li');
        const index = parseInt(task.dataset.arrayIndex);
        taskManager.toggleTaskStatus(index);
        if (checkbox.checked) {
            task.classList.add("completed");
        }
        else {
            task.classList.remove("completed");
        }
        showHideAdditionalButtons();
        syncPendingSummaryWithSW();
    }
    if (target.classList.contains("del-btn") && confirm("Are you sure to Delete?")) {
        const delBtnDiv = target.parentNode;
        const list = delBtnDiv.parentNode;
        const index = parseInt(list.dataset.arrayIndex);
        const tasks = taskManager.removeTask(index);
        listRenderer.display(tasks);
        showHideAdditionalButtons();
        syncPendingSummaryWithSW();
    }
});
taskLists.addEventListener("change", () => {
    showHideAdditionalButtons();
});
search.addEventListener("keyup", event => {
    const inputBox = event.target;
    const searchValue = inputBox.value.toLowerCase();
    if (searchValue) {
        document.querySelector('body')?.classList.add('search');
    }
    else {
        document.querySelector('body')?.classList.remove('search');
    }
    const lists = document.getElementsByTagName("li");
    Array.from(lists).forEach(item => {
        const taskContainer = item.querySelector('label');
        const task = taskContainer.textContent;
        if (task.toLowerCase().includes(searchValue)) {
            item.classList.remove("hidden");
        }
        else {
            item.classList.add("hidden");
        }
    });
});
markAsCompletedButton.addEventListener("click", () => {
    const tasks = taskManager.markAllAsCompleted();
    listRenderer.display(tasks);
    showHideAdditionalButtons();
    syncPendingSummaryWithSW();
});
clearButton.addEventListener("click", () => {
    if (!window.confirm("Are you sure to clear all completed tasks?")) {
        return;
    }
    const tasks = taskManager.clearCompleted();
    listRenderer.display(tasks);
    showHideAdditionalButtons();
    syncPendingSummaryWithSW();
});
function showHideAdditionalButtons() {
    const totalTasks = taskManager.getTasksCount();
    const completedTasks = taskManager.getCompletedTaskCount();
    clearButton.style.visibility = completedTasks > 0 ? "visible" : "hidden";
    if (totalTasks > 0) {
        markAsCompletedButton.style.visibility = completedTasks == totalTasks ? "hidden" : "visible";
    }
    else {
        markAsCompletedButton.style.visibility = "hidden";
    }
}
document.addEventListener("DOMContentLoaded", () => {
    listRenderer.display(taskManager.getTodos());
    showHideAdditionalButtons();
    syncPendingSummaryWithSW();
    if ('Notification' in window && Notification.permission === 'granted') {
        startPendingTaskReminders();
    }
});
function showInstallSnackbar() {
    if (deferredPrompt) {
        window.showSnackbar('install-snackbar');
    }
}
window.showSnackbar = (snackBarId, delay = 3000, timeout = 10000) => {
    const activeSnackbar = document.querySelector('.snackbar.show');
    activeSnackbar?.classList.remove('show');
    const snackBar = document.getElementById(snackBarId);
    setTimeout(() => {
        snackBar?.classList.add('show');
        setTimeout(() => {
            snackBar?.remove();
        }, timeout);
    }, delay);
};
function showNotificationSnackbar() {
    window.showSnackbar('notification-snackbar', 6000);
}
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
});
window.showInstallPromotion = () => {
    deferredPrompt.prompt();
    deferredPrompt = null;
};
window.dismissSnackbar = () => {
    const activeSnackbar = document.querySelector('.snackbar.show');
    activeSnackbar?.classList.remove('show');
};
function getPendingTasksInfo() {
    const todos = taskManager.getTodos();
    const pending = todos.filter(t => !t.completed);
    const count = pending.length;
    const sample = pending[0]?.task || '';
    return { count, sample };
}

function pickMotivationMessage(count, sample) {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    const isWeekend = day === 0 || day === 6;

    const withCount = [
        `You have ${count} task${count === 1 ? '' : 's'} waiting. Let's clear one now!`,
        `${count} pending — small steps, big wins. Try: "${sample || 'your top task'}"`,
        `${count} to go. Future you will thank you!`,
        `Quick win time: ${count} pending. Pick one and crush it 💪`,
    ];

    const earlyMorning = isWeekend
        ? [
            `Weekend boost! Got ${count} pending? Plan one and relax 🎉`,
            `Slow and steady — ${count} to lightly tackle today.`,
        ]
        : [
            `Morning focus: ${count} pending. Start with "${sample || 'a 2‑minute task'}" ☀️`,
            `Set the tone — ${count} pending. Choose your one big thing.`,
        ];

    const midMorning = isWeekend
        ? [
            `What’s your vibe? ${count} pending — line up one easy win ✨`,
            `Quick note: add or clear one — ${count} waiting.`,
        ]
        : [
            `How’s it going? ${count} pending. One step now beats ten later.`,
            `Momentum check: ${count} left. Try: "${sample || 'the next smallest step'}"`,
        ];

    const afternoon = isWeekend
        ? [
            `Halfway there? ${count} pending — wrap one up 🎯`,
            `Afternoon flow — clear one and enjoy the rest 🧘`,
        ]
        : [
            `Midday nudge: ${count} pending. Chip away at one ✅`,
            `You’re doing great. ${count} left — keep the streak!`,
        ];

    const evening = isWeekend
        ? [
            `Evening check: ${count} pending. Set up an easy win 😌`,
            `Get ahead for tomorrow — clear one of ${count} 👣`,
        ]
        : [
            `Evening calm: ${count} pending. One last tidy-up 🌇`,
            `Set tomorrow up right — reduce ${count} to ${Math.max(0, count - 1)} 🎯`,
        ];

    const night = [
        `Before bed: ${count} pending. Park the next step for tomorrow 🌙`,
        `Wind down with clarity — ${count} left. Note one tiny action 🛏️`,
    ];

    let pool = withCount;
    if (hour >= 6 && hour < 9) pool = earlyMorning;
    else if (hour >= 9 && hour < 12) pool = midMorning;
    else if (hour >= 12 && hour < 16) pool = afternoon;
    else if (hour >= 16 && hour < 21) pool = evening;
    else pool = night;

    const all = withCount.concat(pool);
    return all[Math.floor(Math.random() * all.length)];
}

async function showPendingTasksNotification() {
    const { count, sample } = getPendingTasksInfo();
    if (count === 0) return false;
    if (!('Notification' in window) || Notification.permission !== 'granted') return false;

    const title = `📝 ${count} pending task${count === 1 ? '' : 's'}`;
    const body = pickMotivationMessage(count, sample);
    const options = {
        tag: 'pending-tasks',
        body,
        badge: '/images/apple-icon-152x152.png',
        icon: '/images/apple-icon-152x152.png',
        requireInteraction: false,
        renotify: true,
        data: { url: '/' },
        actions: [
            { action: 'open', title: 'Open App' },
            { action: 'close', title: 'Later' },
        ],
    };

    try {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg && 'showNotification' in reg) {
            await reg.showNotification(title, options);
        } else {
            new Notification(title, options);
        }
        const now = Date.now();
        localStorage.setItem('lastTaskNotifyAt', String(now));
        // Update SW throttle state too, so background reminders don't duplicate immediately
        postToActiveSW({ type: 'last_notify_update' });
        return true;
    } catch (e) {
        console.warn('Notification failed:', e);
        return false;
    }
}

function shouldNotify(now = Date.now()) {
    try {
        const last = parseInt(localStorage.getItem('lastTaskNotifyAt') || '0', 10) || 0;
        const minInterval = 60 * 60 * 1000; // 60 minutes
        return now - last >= minInterval;
    } catch {
        return true;
    }
}

let reminderTimerId = null;
function startPendingTaskReminders() {
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;

    // Clear any existing interval
    if (reminderTimerId) {
        clearInterval(reminderTimerId);
        reminderTimerId = null;
    }

    const scheduleNext = () => {
        // Add ±15 min jitter around 60 min
        const base = 60 * 60 * 1000;
        const jitter = Math.floor((Math.random() - 0.5) * 30 * 60 * 1000); // ±15 min
        const delay = Math.max(15 * 60 * 1000, base + jitter); // at least 15 min
        reminderTimerId = setTimeout(async () => {
            // Avoid notifying while user is actively viewing the page
            if (document.visibilityState !== 'visible' && shouldNotify()) {
                await showPendingTasksNotification();
            }
            scheduleNext();
        }, delay);
    };

    // If due already, show soon; otherwise schedule with jitter
    if (shouldNotify()) {
        setTimeout(() => {
            if (document.visibilityState !== 'visible') {
                showPendingTasksNotification();
            }
        }, 10 * 1000);
    }

    scheduleNext();
}

document.addEventListener('visibilitychange', () => {
    // When user leaves the tab, keep the timer; when they return, avoid immediate spam
    if (document.visibilityState === 'visible') {
        // No action needed here; throttle handled in shouldNotify()
    }
});

function postToActiveSW(message) {
    if (!('serviceWorker' in navigator)) return;
    // Prefer controller (page is controlled by SW)
    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage(message);
        return;
    }
    // Fallback to registration.active
    navigator.serviceWorker.ready.then(reg => {
        if (reg.active) reg.active.postMessage(message);
    });
}

function syncPendingSummaryWithSW() {
    try {
        const { count, sample } = getPendingTasksInfo();
        postToActiveSW({ type: 'tasks_summary_update', count, sample });
    } catch {}
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
                return;
            }
        }
        catch (e) {
            console.log(e);
            return;
        }
    }
    // Start reminders after permission is granted
    startPendingTaskReminders();
    // Also push current pending summary to SW
    syncPendingSummaryWithSW();
};
//# sourceMappingURL=app.js.map