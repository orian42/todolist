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
    const taskDate = dayjs(taskList[task].taskDueDate);
    const today = dayjs().format('YYYY-MM-DD');
    var cardClass

    if (dayjs(taskDate).isBefore(today)) {
        cardClass = "redWarn";
    } else if (dayjs(taskDate).isAfter(today)) {
        cardClass = "pending";
    } else {cardClass = "yellowWarn";}

    return cardClass;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    const todoCol = $('#todo-cards');
    todoCol.text('');

    for (i=0; i<taskList.length; i++) {
        todoCol.append('<div class="task-card">');
        const cardData = todoCol.children().eq(i);

        cardData.append(`<div class='task-card-hdr'><h2>${taskList[i].taskTitle}</h2></div>`);
        cardData.append(`<div>${taskList[i].taskDesc}</div>`);
        cardData.append(`<div>${dayjs(taskList[i].taskDueDate).format('M/DD/YYYY')}</div>`);
        cardData.append(`<div><button class="btn btn-danger btn-small delete-item-btn delTaskBtn" assocID=${taskList[i].taskId}>Delete</button></div>`);

        cardData.addClass(createTaskCard(i));
    }

    $( function() {
        $('.task-card').draggable();
    } );
}

// Todo: create a function to handle adding a new task
function handleAddTask(){
    if (taskList === null) {taskList = []};

    const newTaskItem = {
        taskId: nextId,
        taskTitle: $('#taskTitle').val(),
        taskDueDate: $('#taskDueDate').val(),
        taskDesc: $('#taskDesc').val(),
        taskStatus: "to-do"
    }

    taskList.push(newTaskItem);
    localStorage.setItem('tasks', JSON.stringify(taskList));

    $('#dialog-form')[0].reset();
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    let assocID = Number($(event.target).attr('assocID'));
    let filteredArray = taskList.filter(obj => obj.taskId !== assocID);
    localStorage.setItem('tasks', JSON.stringify(filteredArray));
    taskList = JSON.parse(localStorage.getItem("tasks"));
    $(event.target).parent().parent().remove();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();

    $('#todo-cards').on('click', '.delTaskBtn', handleDeleteTask);

    $("#addTaskBtn").click(function() {
        $("#dialog-form").dialog({
            modal: true,
            width: 350,
            buttons: {
                "Add Task": function() {
                    generateTaskId();
                    handleAddTask();
                    renderTaskList();
                    $(this).dialog("close");
                },
                "Cancel": function() {
                    $(this).dialog("close");
                }
            }
        });
    });

    $( function() {
        $('.droppable').droppable({
            drop: function( event, ui ) {
                $( this )
                .addClass( "ui-state-highlight" );
            // renderTaskList();   ---------------------commented out for now
            }
        });
        
    } );
});