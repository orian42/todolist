// Define global variables
var currentID;
var newStatus;

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
function createTaskCard(statuslist, task) {
    const taskDate = dayjs(statuslist[task].taskDueDate);
    const today = dayjs().format('YYYY-MM-DD');
    var cardClass
    //Formatting will depend on whether the task is due today, due in the future, overdue, or completed
    if (statuslist[task].taskStatus === 'done-cards') {
        //Tasks that are done will have a subdued grayish colorscheme
        cardClass = "done";
    } else if (dayjs(taskDate).isBefore(today)) {
        //overdue tasks will have a reddish color scheme
        cardClass = "redWarn";
    } else if (dayjs(taskDate).isAfter(today)) {
        //tasks due in the future will have a greenish color scheme
        cardClass = "pending";
        //tasks due today will have a yellowish color scheme
    } else {cardClass = "yellowWarn";}

    return cardClass;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    //Define variables for the three columns
    const todoCol = $('#todo-cards');
    const progCol = $('#in-progress-cards');
    const doneCol = $('#done-cards');
    //filter the "tasklist" array three different ways based on the status of each task
    let todoArray = taskList.filter(obj => obj.taskStatus === 'todo-cards');
    let progArray = taskList.filter(obj => obj.taskStatus == 'in-progress-cards');
    let doneArray = taskList.filter(obj => obj.taskStatus === 'done-cards');
    //Clear the board prior to rendering
    todoCol.text('');
    progCol.text('');
    doneCol.text('');
    //Inner function for rendering each column based on task status
    function renderColumns (taskColumn, statusList) {
        for (i=0; i<statusList.length; i++) {
            //note the custom attribute below: "assocID" (meaning associated ID)
            //This stores the unique task ID in the card itself to be called later
            taskColumn.append(`<div class="task-card" assocID=${statusList[i].taskId}>`);
            const cardData = taskColumn.children().eq(i);

            cardData.append(`<div class='task-card-hdr'><h2>${statusList[i].taskTitle}</h2></div>`);
            cardData.append(`<div>${statusList[i].taskDesc}</div>`);
            cardData.append(`<div>${dayjs(statusList[i].taskDueDate).format('M/DD/YYYY')}</div>`);
            cardData.append(`<div><button class="btn btn-danger btn-small delete-item-btn delTaskBtn">Delete</button></div>`);
            //Function called to format the above elements in "post-it"-looking card in the browser
            cardData.addClass(createTaskCard(statusList, i));
        }
    }
    //Three calls of the above local function
    renderColumns (todoCol, todoArray);
    renderColumns (progCol, progArray);
    renderColumns (doneCol, doneArray);
    //Make the cards draggable
    $( function() {
        $('.task-card').draggable();
    } );
}

// Todo: create a function to handle adding a new task
function handleAddTask(){
    //Create a tasklist array if one does not already exist
    if (taskList === null) {taskList = []};

    const newTaskItem = {
        taskId: nextId,
        taskTitle: $('#taskTitle').val(),
        taskDueDate: $('#taskDueDate').val(),
        taskDesc: $('#taskDesc').val(),
        taskStatus: "todo-cards"
    }
    //append the new task to the array then save the array in local storage
    taskList.push(newTaskItem);
    localStorage.setItem('tasks', JSON.stringify(taskList));

    $('#dialog-form')[0].reset();
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    //Custom attribute used here
    let assocID = Number($(event.target).parent().parent().attr('assocID'));
    let filteredArray = taskList.filter(obj => obj.taskId !== assocID);
    localStorage.setItem('tasks', JSON.stringify(filteredArray));
    taskList = JSON.parse(localStorage.getItem("tasks"));
    $(event.target).parent().parent().remove();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    //Identify the object in the array that is associated with the card that was dragged
    const currentTask = taskList.find(obj => obj.taskId === currentID);
    if (currentTask) {
        //Update the appropriate object with the new status
        currentTask.taskStatus = newStatus;
    }
    localStorage.setItem('tasks', JSON.stringify(taskList));
    console.log(currentTask);
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();

    //delete the task and remove the card
    $('.lane').on('click', '.delTaskBtn', handleDeleteTask);

    //Custom attribute used here - the unique ID of the associated object is passed to a global
    //variable when the card is dragged
    $('.lane').on('dragstart', '.task-card', function() {currentID = Number($(this).attr('assocID'))});

    //Modal form for entering in new task information
    $("#addTaskBtn").click(function() {
        $("#dialog-form").dialog({
            //datepicker was automatically added as part of the modal form
            modal: true,
            width: 350,
            buttons: {
                "Save Task": function() {
                    // generateTaskId();
                    // handleAddTask();
                    // renderTaskList();
                    $(this).dialog("close");
                },
                "Cancel": function() {
                    $(this).dialog("close");
                }
            }
        });
    });

    //Lanes are droppable and what occurs after the drop
    $( function() {
        $('.droppable').droppable({
            drop: function( event, ui ) {
                newStatus = $(this).children().attr('id');
                handleDrop();
                renderTaskList();
            }
        });
    } );
    //Does not allow task cards to remain in an undroppable space
    $( function() {
        $(':not(".droppable")').droppable({
            drop: function(event, ui) {
                renderTaskList();
            }
        })
    } );

});