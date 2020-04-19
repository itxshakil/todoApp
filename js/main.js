const ul = document.querySelector("#tasks-list");
const searchForm = document.forms[0];
const addForm = document.forms[1];
const search = document.querySelector("#search");
let todos = [];

ul.addEventListener("click", event => {
  if (event.target.classList.contains("del-btn")) {
    if (confirm("Are you sure to Delete?")) {
      let todos = Storage.getTodos();
      let index = event.target.parentNode.parentNode.dataset.arrayIndex;
      todos.todoList.splice(index, 1);
      Storage.setItem(todos);
      UI.showTodo();
    }
  } else if (event.target.tagName.toUpperCase() === "INPUT") {
    let checkbox = event.target;
    let list = checkbox.parentNode.parentNode;
    let index = list.dataset.arrayIndex;
    if (checkbox.checked) {
      let todos = Storage.getTodos();
      todos.todoList[index].completed = true;
      Storage.setItem(todos);
      list.classList.add("completed");
    } else {
      let todos = Storage.getTodos();
      todos.todoList[index].completed = false;
      Storage.setItem(todos);
      list.classList.remove("completed");
    }
  }
});
addForm.addEventListener("submit", event => {
  event.preventDefault();
  if (addForm.querySelector("input").value == "") {
    showToast("Please Enter Text");
  } else {
    if (Storage.isSupported()) {
      let value = addForm.querySelector("input").value;
      Storage.addTask(value);
      addForm.querySelector("input").value = "";
    }
  }
});

class UI {
  static showTodo() {
    const length = todos.length;
    // Clear Previous Screen
    while (ul.firstChild) {
      ul.removeChild(ul.firstChild);
    }
    if (length > 0) {
      for (let index = 0; index < length; index++) {
        let list = document.createElement("li");
        list.classList.add("todo-item");
        if (todos[index].completed) {
          list.classList.add("completed");
        }
        list.setAttribute("data-array-index", index);
        list.innerHTML = `<div>${todos[index].task}</div>
              <div class="right">
                <input type="checkbox" ${
          todos[index].completed ? "checked" : ""
          } />
                <button class="del-btn">x</button>
              </div>`;
        ul.appendChild(list);
      }
      if (length > 1000) {
        showToast(
          "Hey User , You can Delete unnecessary Todos for smooth use."
        );
      }
    } else {
      ul.innerHTML = '<strong class="todo-item">No Task Found.</strong>';
    }
  }
  static SetAPP() {
    ToDo.getTodos().then(UI.showTodo());
  }
}
class Storage {
  static setItem(item) {
    try {
      localStorage.setItem("todos", JSON.stringify(item));
      ToDo.getTodos();
    } catch (error) {
      showToast("Unable To add");
    }
  }
  static getTodos() {
    if (localStorage.getItem("todos")) {
      let data = localStorage.getItem("todos");
      return JSON.parse(data);
    } else {
      Storage.setItem({ todoList: [] });
      showToast('Please add Task.');
      this.getTodos();
    }
  }
  static isSupported() {
    if (typeof Storage === "undefined") {
      showToast("Sorry! Your Browser Don't Support Web Storage. ");
      return false;
    }
    return true;
  }
  static addTask(task) {
    let data = this.getTodos();
    data.todoList.push({ task: task, completed: false });
    Storage.setItem(data);
    UI.SetAPP();
  }
  static clearAll() {
    Storage.setItem({ todoList: [] });
    UI.showTodo();
  }
}
class ToDo {
  static async getTodos() {
    todos = Storage.getTodos().todoList;
  }

  static markAsCompleted() {
    console.log(todos = Storage.getTodos().todoList);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  UI.SetAPP();
});

// search Form
search.addEventListener("keyup", e => {
  let text = e.target.value.toLowerCase();
  let lists = document.getElementsByTagName("li");
  // Convert HTML Collection to Array .Array.from
  Array.from(lists).forEach(item => {
    let task = item.firstChild.textContent;
    if (task.toLowerCase().indexOf(text) != -1) {
      item.classList.remove("hidden");
    } else {
      item.classList.add("hidden");
    }
  });
});

function showToast(notification) {
  // Get the snackbar DIV
  var toast = document.getElementById("snackbar");
  toast.innerHTML = notification;
  toast.className = "show";
  setTimeout(function () {
    toast.className = toast.className.replace("show", "");
  }, 3000);
}

function markAsCompleted() {
  let data = Storage.getTodos();
  data.todoList.forEach(function (item) {
    item.completed = true;
  })

  Storage.setItem(data);
  UI.showTodo();
}

function clearCompleted() {
  let data = Storage.getTodos();
  data.todoList = data.todoList.filter(function (item) {
    return item.completed == false;
  })
  Storage.setItem(data);

  UI.showTodo();
}
