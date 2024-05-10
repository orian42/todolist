// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    if (nextId === null) {nextId = 0};
    nextId++;
    localStorage.setItem('nextId', nextId);
}

// Todo: create a function to create a task card
function createTaskCard(task) {

}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

}

// Todo: create a function to handle adding a new task
function handleAddTask(){
    if (taskList === null) {taskList = []};

    const newTaskItem = {
        taskID: nextId,
        taskTitle: $('#taskTitle').val(),
        taskDueDate: $('#taskDueDate').val(),
        taskDesc: $('#taskDesc').val()
    }

    taskList.push(newTaskItem);
    localStorage.setItem('tasks', JSON.stringify(taskList));

    $('#dialog-form')[0].reset();
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    $("#addTaskBtn").click(function() {
        $("#dialog-form").dialog({
            modal: true,
            width: 350,
            buttons: {
                "Add Task": function() {
                    generateTaskId();
                    handleAddTask();
                    $(this).dialog("close");
                },
                "Cancel": function() {
                    $(this).dialog("close");
                }
            }
        });
    });
});