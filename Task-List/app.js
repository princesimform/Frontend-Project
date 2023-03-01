// Define UI Variables

const form = document.querySelector('#task-form');
const tasklist = document.querySelector('.collection');
const clearBtn = document.querySelector('.clear-tasks');
const filter = document.querySelector('#filter');
const taskInput = document.querySelector('#task');


// Load all Event listeners

loadEventListeners();

function loadEventListeners() {


    //DOM Load Event
    document.addEventListener('DOMContentLoaded', getTasks);

    form.addEventListener('submit', addTask);

    //Remove Task
    tasklist.addEventListener('click', removeTask);

    //Clear Task Events
    clearBtn.addEventListener('click', clearTask);

    //Fliter Task

    filter.addEventListener('keyup', filterTask);
}

function addTask(e) {
    if (taskInput.value === '') {
        alert('Add a Task')
    } else {

        //Create Li Element

        const li = document.createElement('li');
        li.className = 'collection-item';

        // text Node and Append to li

        li.appendChild(document.createTextNode(taskInput.value));

        //Create new Link Element

        const link = document.createElement('a');
        link.className = 'delete-item secondary-content';

        link.innerHTML = `<i class="fa-solid fa-xmark"></i>`;

        //Append to li

        li.appendChild(link)

        //Appent li to ul
        tasklist.appendChild(li)

        // Store in Local Storage
        storeTaskInLocalStorage(taskInput.value);


        //clear input
        taskInput.value = "";

    }

    e.preventDefault()
}

function getTasks() {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = []
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    tasks.forEach((task) => {
        //Create Li Element

        const li = document.createElement('li');
        li.className = 'collection-item';

        // text Node and Append to li

        li.appendChild(document.createTextNode(task));

        //Create new Link Element

        const link = document.createElement('a');
        link.className = 'delete-item secondary-content';
        link.innerHTML = `<i class="fa-solid fa-xmark"></i>`;

        //Append to li
        li.appendChild(link)

        //Appent li to ul
        tasklist.appendChild(li)
    })
}
function storeTaskInLocalStorage(task) {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = []
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    tasks.push(task);

    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function removeTask(e) {


    if (e.target.parentElement.classList.contains('delete-item')) {
        removeTaskFormLocalStorage(e.target.parentElement.parentElement);
        e.target.parentElement.parentElement.remove();

    }
}

function removeTaskFormLocalStorage(taskItem) {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = []
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    tasks.forEach((task, index) => {
        if (taskItem.textContent === task) {
            tasks.splice(index, 1);
        }
    })
    console.log(taskItem);

    localStorage.setItem('tasks' , JSON.stringify(tasks))
}
function clearTask() {
    while (tasklist.firstChild) {
        tasklist.removeChild(tasklist.firstChild)
    }

    localStorage.clear();
}

function filterTask(e) {
    const text = e.target.value.toLowerCase();
    document.querySelectorAll('.collection-item').forEach((task) => {
        const item = task.firstChild.textContent;
        if (item.toLowerCase().indexOf(text) != -1) {
            task.style.display = 'block'
        } else {
            task.style.display = 'none'
        }

    })

}