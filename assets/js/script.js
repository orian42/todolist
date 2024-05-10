// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    return 1;
}

// Todo: create a function to create a task card
function createTaskCard(task) {

}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

}

// Todo: create a function to handle adding a new task
function handleAddTask(taskInfo){
    console.log(taskInfo);

    localStorage.setItem('task', taskInfo);
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

});


//modal form code
$( function() {
    var form,

    taskID = generateTaskId(),
    taskTitle = $( "#taskTitle" ),
    TaskDueDate = $( "#TaskDueDate" ),
    taskDesc = $( "#taskDesc" ),
    taskStatus = "notStarted",
    allFields = $( [] ).add( taskID ).add( taskTitle ).add( TaskDueDate ).add( taskDesc ).add ( taskStatus),

    dialog = $( "#dialog-form" ).dialog({
        autoOpen: false,
        height: 420,
        width: 500,
        modal: true,
        buttons: {
            "Add Task": handleAddTask,
            Cancel: function() {
            dialog.dialog( "close" );
            }
        },
        close: function() {
            form[ 0 ].reset();
            allFields.removeClass( "ui-state-error" );
        }
    });

    form = dialog.find( "form" ).on( "submit", function( event ) {
        event.preventDefault();
        handleAddTask();
    });

    $( "#addTaskBtn" ).button().on( "click", function() {
        dialog.dialog( "open" );
    });
} );