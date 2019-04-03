const main=document.querySelector('main');
const ul=document.querySelector('#tasks-list');
const searchForm =document.forms[0];
const addForm=document.forms[1];

ul.addEventListener('click' , (e)=>{
    if(e.target.tagName.toUpperCase() === 'INPUT'){
        let checkbox = e.target;
        console.log(checkbox);
        if(checkbox.checked){
            let todos = JSON.parse(window.localStorage.getItem('todos'));
            let index =e.target.parentNode.parentNode.dataset.arrayIndex;
            todos.todoList[index].completed= true;
            console.log(checkbox.parentNode.parentNode.classList.add('completed'));
            window.localStorage.setItem('todos',JSON.stringify(todos));
        }
        else{
            let todos = JSON.parse(window.localStorage.getItem('todos'));
            let index =e.target.parentNode.parentNode.dataset.arrayIndex;
            todos.todoList[index].completed= false;
            window.localStorage.setItem('todos',JSON.stringify(todos));
        }
    }
})
addForm.addEventListener('submit' , (e)=>{
    e.preventDefault();
    let value = addForm.querySelector('input').value;
    console.log('Submitted' ,  addForm.querySelector('input').value);
    let todosData = window.localStorage.getItem('todos') ? JSON.parse(window.localStorage.getItem('todos')) : {
        todoList:[]
    } ;
    let todoItem ={
        'task':value,
        'completed':false
    };
    addForm.querySelector('input').value = '';
    todosData.todoList.push(todoItem);
    window.localStorage.setItem('todos',JSON.stringify(todosData));
    showTodo();
})

// search Form
searchForm.addEventListener('keyup' , (e)=>{
    console.log(e.target.value);
})

main.addEventListener('click' , (e)=>{
    if(e.target.classList.contains('del-btn')){
        let todos = JSON.parse(window.localStorage.getItem('todos'));
        let index =e.target.parentNode.parentNode.dataset.arrayIndex;
        todos.todoList.splice(index , 1);
        window.localStorage.setItem('todos' , JSON.stringify(todos));
        showTodo();
    }
});


// Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellendus, repellat!
// <span class="float-right">
//     <input type="checkbox" name="" id=""><button class="del-btn">x</button>
// </span>

function showTodo(){
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }
    let data = JSON.parse(window.localStorage.getItem('todos'));
    for(let limit=data.todoList.length , i = 0 ; i < limit ; i++) {
        let liItem = document.createElement('li');
        liItem.classList.add('todo-item');
        liItem.setAttribute('data-array-index' , i);
        let tasks = document.createElement('span');
        let taskText = document.createTextNode(data.todoList[i].task);
        tasks.appendChild(taskText);
        let floatItem = document.createElement('span');
        floatItem.classList.add('float-right');
        let checkbox=document.createElement('input');
        checkbox.setAttribute('type' , 'checkbox');
        if(data.todoList[i].completed){
            checkbox.checked='true';
            liItem.classList.add('completed');
        }
        let button = document.createElement('button');
        button.classList.add('del-btn');
        let buttonText = document.createTextNode('x');
        button.innerText = 'x';
        floatItem.appendChild(checkbox);
        floatItem.appendChild(button);
        liItem.appendChild(tasks);
        liItem.appendChild(floatItem);
        ul.appendChild(liItem);
    } 
}