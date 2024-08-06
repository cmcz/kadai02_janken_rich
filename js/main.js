$(document).ready(function() {
    let personCount = 0;
    let taskCount = 0;

    // Add new items
    $("#newPerson").on("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            addPerson();
        }
    });

    $("#newTask").on("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            addTask();
        }
    });

    // Add fav tags
    $(".fav-member").on('click', function() {
        addFavPerson($(this).text());
    });

    $(".fav-task").on('click', function() {
        addFavTask($(this).text());
    });

    // Random
    $("#assign").on("click", function() {
        if (personCount !== taskCount) {
            alert("メンバーとタスクの数が同じでなければなりません");
        } else if (personCount === 0) {
            alert("少なくともメンバー1人を追加する必要があります");
        } else {
            assignTasks();
            $('#popup_result').show();
        }
    });

    //////// popup ////////
    $("#close_popup_result").on('click', function() {
        $('#popup_result').hide();
    });

    $("#close_popup_history").on('click', function() {
        $('#popup_history').hide();
    });

    // Local Storage
    $("#remove_history").on("click", function() {
        localStorage.removeItem("assignments");
    });

    $("#show_history").on("click", function() {
        const historyList = $('#historyAssignment ul');
        historyList.empty();

        const assignments = JSON.parse(localStorage.getItem("assignments"));
        if (assignments) {
            assignments.forEach(function(assignment) {
                $('#historyAssignment ul').append(`<li>${assignment}</li>`);
            });
        } else {
            $('#historyAssignment ul').append(`<li>記録なし</li>`);
        }

        $('#popup_history').show();
    });

    ////////////////////////////////////////////////
    function addPerson() {
        personCount++;
        const newPersonName = $('#newPerson').val();
        const newLiItem = $('<li onclick="removeItem(this)"></li>').attr('id', 'person' + personCount).text(newPersonName);
        $('#personList').append(newLiItem);
        $('#newPerson').val('');
    }

    function addFavPerson(newPersonName) {
        personCount++;
        const newLiItem = $('<li onclick="removeItem(this)"></li>').attr('id', 'person' + personCount).text(newPersonName);
        $('#personList').append(newLiItem);
        $('#newPerson').val('');
    }

    function addTask() {
        taskCount++;
        const newTaskName = $('#newTask').val();
        const newLiItem = $('<li onclick="removeItem(this)"></li>').attr('id', 'task' + taskCount).text(newTaskName);
        $('#taskList').append(newLiItem);
        $('#newTask').val('');
    }

    function addFavTask(newTaskName) {
        taskCount++;
        const newLiItem = $('<li onclick="removeItem(this)"></li>').attr('id', 'task' + taskCount).text(newTaskName);
        $('#taskList').append(newLiItem);
        $('#newTask').val('');
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function assignTasks() {
        $("#finalAssignment ul").empty();
        const tasks = Array.from({ length: taskCount }, (_, i) => i + 1);
        const tasksShuffled = shuffle(tasks);
        const assignments = [];

        for (let i = 1; i <= personCount; i++) {
            const currPerson = $('#person' + i).text();
            const assignTask = $('#task' + tasksShuffled[i - 1]).text();
            const assignment = `${currPerson} : ${assignTask}`;
            assignments.push(assignment);
            $("#finalAssignment ul").append(`<li>${assignment}</li>`);
        }

        // Save assignments to localStorage
        const newAssignments = [];
        $("#finalAssignment ul li").each(function() {
            newAssignments.push($(this).text());
        });

        // Retrieve existing assignments from localStorage
        const existingAssignments = JSON.parse(localStorage.getItem("assignments")) || [];
        const updatedAssignments = existingAssignments.concat(newAssignments);

        // Save updated assignments to localStorage
        localStorage.setItem("assignments", JSON.stringify(updatedAssignments));
    }

    window.removeItem = function(el) {
        el.remove();
        if (el.id.includes('person')) {
            personCount--;
        } else {
            taskCount--;
        }
    };

});