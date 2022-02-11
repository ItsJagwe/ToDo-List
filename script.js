const formInput = document.querySelector(".todo-input");
const formBtn = document.querySelector(".todo-btn");
const toDoList = document.querySelector(".todo-list");
const filterTasks = document.querySelector(".filter_tasks");


let allTasks;
let doneTasks;

//Function to add the tasks in the list

function addVal(event) {
    event.preventDefault();

    let value = formInput.value;
    if (value === "") {
        alert("Please Enter Something!")
    } else {

        //Adding value to the local storage
        saveTasks(value);
        formInput.value = '';
        formInput.focus();
        display();
    }
}


//Function to Display Items
function display() {
    toDoList.innerHTML = "";
    if (localStorage.getItem('allTasks') === null) {
        allTasks = [];
    } else {
        allTasks = JSON.parse(localStorage.getItem('allTasks'));
    }

    if (localStorage.getItem('doneTasks') === null) {
        doneTasks = [];
    } else {
        doneTasks = JSON.parse(localStorage.getItem('doneTasks'));
    }

    allTasks.slice().reverse().forEach((task) => {

        const toDoDiv = document.createElement('div');
        toDoDiv.classList.add('todo');

        //Adding List
        const newTask = document.createElement('li');
        newTask.innerText = task;
        newTask.classList.add('todo-item');
        toDoDiv.appendChild(newTask);


        //Adding CheckBox

        const checkBtn = document.createElement('button');
        checkBtn.innerHTML = '<i class="fas fa-check"></i>';
        checkBtn.classList.add("checkBtn");
        toDoDiv.appendChild(checkBtn);

        //Adding Delete Button 
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.classList.add("deleteBtn");
        toDoDiv.appendChild(deleteBtn);

        toDoList.appendChild(toDoDiv);
        formInput.style.height = null;
    });

    doneTasks.slice().reverse().forEach(function (task) {
        const toDoDiv = document.createElement('div');
        toDoDiv.classList.add('todo');

        //Adding List
        const newTask = document.createElement('li');
        newTask.innerText = task;
        newTask.classList.add('todo-item');
        newTask.classList.add('completed');
        toDoDiv.appendChild(newTask);


        //Adding CheckBox
        const checkBtn = document.createElement('button');
        checkBtn.innerHTML = '<i class="fas fa-check"></i>';
        checkBtn.classList.add("checkBtn");
        toDoDiv.appendChild(checkBtn);

        //Adding Delete Button 
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.classList.add("deleteBtn");
        toDoDiv.appendChild(deleteBtn);

        toDoList.appendChild(toDoDiv);
        formInput.style.height = null;
    })
}


//Function to save tasks in the local storage
function saveTasks(value) {
    let found = 0;
    if (localStorage.getItem('allTasks') === null) {
        allTasks = [];
    } else {
        allTasks = JSON.parse(localStorage.getItem('allTasks'));
    }
    for (let i = 0; i < allTasks.length; i++) {
        if (allTasks[i] === value) {
            found = 1;
            alert("Already Inserted!");
        }
    }
    if (found == 0) {
        allTasks.push(value);
        localStorage.setItem('allTasks', JSON.stringify(allTasks));
    }

}



//Checking/Striking
function checkVal(event) {
    const item = event.target;


    //delete
    if (item.classList[0] === 'deleteBtn') {
        //removing local data
        Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            style: {
                width: "20%",
            }
        }).then((result) => {
            if (result.isConfirmed) {

                delVal(item.parentElement);
            }
        })
    }

    // check
    if (item.classList[0] === 'checkBtn') {
        let task = item.previousElementSibling;
        task.classList.toggle("completed");
        strikeTasks(task);
    }
}


//Delete Function
function delVal(task) {

    //Rmoving from the main array
    allTasks = JSON.parse(localStorage.getItem('allTasks'));
    let item = task.firstChild.innerText;
    allTasks = allTasks.filter(obj => obj != item);
    localStorage.setItem('allTasks', JSON.stringify(allTasks));
    task.remove();
    //Rmoving from the done array
    doneTasks = JSON.parse(localStorage.getItem('doneTasks'));
    item = task.firstChild.innerText;
    doneTasks = doneTasks.filter(obj => obj != item);
    localStorage.setItem('doneTasks', JSON.stringify(doneTasks));
    task.remove();
    Toastify({
        text: "Task Successfully Deleted",
        className: "info",
        duration: 3000,
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
    }).showToast();
}



function strikeTasks(task) {
    //Getting the main array
    if (localStorage.getItem('allTasks') === null) {
        allTasks = [];
    } else {
        allTasks = JSON.parse(localStorage.getItem('allTasks'));
    }

    //Making the new done array
    if (localStorage.getItem('doneTasks') === null) {
        doneTasks = [];
    } else {
        doneTasks = JSON.parse(localStorage.getItem('doneTasks'));
    }

    let taskEl = task.innerText;
    if (!doneTasks.includes(taskEl)) {
        doneTasks.push(taskEl);
        localStorage.setItem('doneTasks', JSON.stringify(doneTasks));

        //Delete from general array
        allTasks.splice(allTasks.indexOf(taskEl), 1);
        localStorage.setItem("allTasks", JSON.stringify(allTasks));
        location.reload();
    } else {
        //Deleting from done array 
        doneTasks.splice(doneTasks.indexOf(taskEl), 1);
        localStorage.setItem('doneTasks', JSON.stringify(doneTasks));
        location.reload();
        saveTasks(taskEl);
    }
}



//Function to filter the tasks
function filterList(e) {
    const taskList = toDoList.childNodes;
    taskList.forEach(function (task) {
        taskChild = task.firstChild;
        //To check if its clicked on all/completed/uncompleted
        switch (e.target.value) {
            case "all":
                task.style.display = "flex";
                break;
            case "completed":
                if (taskChild.classList.contains("completed")) {
                    task.style.display = "flex";
                } else {
                    task.style.display = "none";
                }
                break;
            case "uncompleted":
                if (!taskChild.classList.contains("completed")) {
                    task.style.display = "flex";
                } else {
                    task.style.display = "none";
                }
        }
    });
}



//To set the height of the textarea
formInput.oninput = function () {
    formInput.style.height = "";
    formInput.style.height = formInput.scrollHeight + "px"
};




// Adding Event Listeners To The Buttons

formBtn.addEventListener('click', addVal);

// Adding Eventlistener here to get the id of the button clicked
toDoList.addEventListener('click', checkVal);

// Adding Eventlistener here to trigger filter function on button click
filterTasks.addEventListener('click', filterList);


//Giving the dom values of the array to display
window.addEventListener('DOMContentLoaded', display);