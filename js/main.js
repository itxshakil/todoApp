const main = document.querySelector('main');
const ul = document.querySelector('#tasks-list');
const searchForm = document.forms[0];
const addForm = document.forms[1];
const search = document.querySelector('#search');

// Checkbox Handler
ul.addEventListener('click', (e) => {
    if (e.target.tagName.toUpperCase() === 'INPUT') {
        let checkbox = e.target;
        let parentli = e.target.parentNode.parentNode.parentNode;
        if (checkbox.checked) {
            let todos = JSON.parse(window.localStorage.getItem('todos'));
            let parentli = e.target.parentNode.parentNode.parentNode;
            let index = parentli.dataset.arrayIndex;
            todos.todoList[index].completed = true;
            parentli.classList.add('completed');
            window.localStorage.setItem('todos', JSON.stringify(todos));
        } else {
            let todos = JSON.parse(window.localStorage.getItem('todos'));
            let index = parentli.dataset.arrayIndex;
            todos.todoList[index].completed = false;
            parentli.classList.remove('completed');
            window.localStorage.setItem('todos', JSON.stringify(todos));
        }
    }
})
//Add Form Listener
addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if(addForm.querySelector('input').value == ''){
        showToast('Please Enter Text');
    }else{
        if (typeof (Storage) !== "undefined") {
            let value = addForm.querySelector('input').value;
            console.log('Submitted', addForm.querySelector('input').value);
            let todosData = window.localStorage.getItem('todos') ? JSON.parse(window.localStorage.getItem('todos')) : {
                todoList: []
            };
            let todoItem = {
                'task': value,
                'completed': false
            };
            addForm.querySelector('input').value = '';
            todosData.todoList.push(todoItem);
            try {
                window.localStorage.setItem('todos', JSON.stringify(todosData));
            } catch (domException) {
                if (domException.name === 'QuotaExceededError' || domException.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                    alert('Can\'t Add ,Please Delete Some task either App will crash.');
                }
    
            }
            showTodo();
        } else {
            showToast('Sorry! No Web Storage Support');
        }
    }
    
})

// search Form
search.addEventListener('keyup', (e) => {
    let text = e.target.value.toLowerCase();
    let lists = document.getElementsByTagName('li');
    // Convert HTML Collection to Array .Array.from
    Array.from(lists).forEach((item) => {
        let task = item.firstChild.textContent;
        if (task.toLowerCase().indexOf(text) != -1) {
            item.style.display = 'block';

        } else {
            item.style.display = 'none';
        }
    })
})

// delete Event
main.addEventListener('click', (e) => {
    if (e.target.classList.contains('del-btn')) {
        if (confirm('Are you sure?')) {
            let todos = JSON.parse(window.localStorage.getItem('todos'));
            let index = e.target.parentNode.parentNode.dataset.arrayIndex;
            todos.todoList.splice(index, 1);
            window.localStorage.setItem('todos', JSON.stringify(todos));
            showTodo();
        }
    }
});

function showTodo() {
    // Clear Prevoius Screen
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }
    let data = JSON.parse(window.localStorage.getItem('todos'));
    const length = data.todoList.length;
    if (length > 0) {
        for (let i = 0; i < length; i++) {
            let liItem = document.createElement('li');
            liItem.classList.add('todo-item');
            liItem.setAttribute('data-array-index', i);
            let tasks = document.createElement('span');
            let taskText = document.createTextNode(data.todoList[i].task);
            tasks.appendChild(taskText);
            let clearfix = document.createElement('span');
            clearfix.classList.add('clearfix');
            let floatItem = document.createElement('span');
            floatItem.classList.add('float-right');
            let checkbox = document.createElement('input');
            checkbox.setAttribute('type', 'checkbox');
            if (data.todoList[i].completed) {
                checkbox.checked = 'true';
                liItem.classList.add('completed');
            }
            let button = document.createElement('button');
            button.classList.add('del-btn');
            let buttonText = document.createTextNode('x');
            button.innerText = 'x';
            floatItem.appendChild(checkbox);
            floatItem.appendChild(button);
            liItem.appendChild(tasks);
            clearfix.appendChild(floatItem);
            liItem.appendChild(clearfix);
            ul.appendChild(liItem);
        }
        if (length > 10000) {
            showToast('Hey User , You can Delete unnecessary Todos for smooth use.');
        }
    } else {
        document.getElementById('tasks-list').innerHTML = '<h3 style="text-align:center;">No Task</h3>'
    }
}

function showToast(notification) {
    // Get the snackbar DIV
    var toast = document.getElementById("snackbar");
    toast.innerHTML = notification;
    toast.className = "show";
    setTimeout(function () {
        toast.className = toast.className.replace("show", "");
    }, 3000);
}