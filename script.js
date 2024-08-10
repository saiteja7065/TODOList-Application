let todoItemsContainer = document.getElementById("todoItemsContainer");
let addTodoButton = document.getElementById("addTodoButton");
let saveTodoButton = document.getElementById("saveTodoButton");

// Save the current todo list to local storage
saveTodoButton.onclick = function() {
    localStorage.setItem("todoList", JSON.stringify(todoList));
}

// Retrieve the todo list from local storage
function getTodoListFromLocalStorage() {
    let stringifiedTodoList = localStorage.getItem("todoList");
    let parsedTodoList = JSON.parse(stringifiedTodoList);
    return parsedTodoList === null ? [] : parsedTodoList;
}

let todoList = getTodoListFromLocalStorage();
let todosCount = todoList.length;

function onTodoStatusChange(checkboxId, labelId, todoId) {
    let checkboxElement = document.getElementById(checkboxId);
    let labelElement = document.getElementById(labelId);
    labelElement.classList.toggle('checked');

    // Update the corresponding todo item in the list
    let todoIndex = todoList.findIndex(todo => 'todo' + todo.uniqueNo === todoId);
    todoList[todoIndex].isCompleted = checkboxElement.checked;
    localStorage.setItem("todoList", JSON.stringify(todoList));
}

function onDeleteTodo(todoId) {
    let todoElement = document.getElementById(todoId);
    todoItemsContainer.removeChild(todoElement);

    // Update the todo list by filtering out the deleted item
    todoList = todoList.filter(todo => 'todo' + todo.uniqueNo !== todoId);
    localStorage.setItem("todoList", JSON.stringify(todoList));
}

function createAndAppendTodo(todo) {
    let todoId = 'todo' + todo.uniqueNo;
    let checkboxId = 'checkbox' + todo.uniqueNo;
    let labelId = 'label' + todo.uniqueNo;

    let todoElement = document.createElement("li");
    todoElement.classList.add("todo-item-container", "d-flex", "flex-row");
    todoElement.id = todoId;
    todoItemsContainer.appendChild(todoElement);

    let inputElement = document.createElement("input");
    inputElement.type = "checkbox";
    inputElement.id = checkboxId;
    inputElement.checked = todo.isCompleted; // Set the checkbox status based on the stored value

    inputElement.onclick = function() {
        onTodoStatusChange(checkboxId, labelId, todoId);
    }

    inputElement.classList.add("checkbox-input");
    todoElement.appendChild(inputElement);

    let labelContainer = document.createElement("div");
    labelContainer.classList.add("label-container", "d-flex", "flex-row");
    todoElement.appendChild(labelContainer);

    let labelElement = document.createElement("label");
    labelElement.setAttribute("for", checkboxId);
    labelElement.id = labelId;
    labelElement.classList.add("checkbox-label");
    if (todo.isCompleted) {
        labelElement.classList.add('checked'); // Add 'checked' class if the item is completed
    }
    labelElement.textContent = todo.text;
    labelContainer.appendChild(labelElement);

    let deleteIconContainer = document.createElement("div");
    deleteIconContainer.classList.add("delete-icon-container");
    labelContainer.appendChild(deleteIconContainer);

    let deleteIcon = document.createElement("i");
    deleteIcon.classList.add("far", "fa-trash-alt", "delete-icon");

    deleteIcon.onclick = function() {
        onDeleteTodo(todoId);
    };

    deleteIconContainer.appendChild(deleteIcon);
}

for (let todo of todoList) {
    createAndAppendTodo(todo);
}

function onAddTodo() {
    let userInputElement = document.getElementById("todoUserInput");
    let userInputValue = userInputElement.value;

    if (userInputValue === "") {
        alert("Enter Valid Text");
        return;
    }

    todosCount = todosCount + 1;

    let newTodo = {
        text: userInputValue,
        uniqueNo: todosCount,
        isCompleted: false
    };

    todoList.push(newTodo); // Add the new todo item to the list
    createAndAppendTodo(newTodo);
    userInputElement.value = "";

    localStorage.setItem("todoList", JSON.stringify(todoList)); // Save the updated list to local storage
}

addTodoButton.onclick = function() {
    onAddTodo();
}