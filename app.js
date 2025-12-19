let tasks = []
let editingTaskId = null;


const taskModal = document.getElementById("taskModal");





const addTaskBtn = document.getElementById("addTaskBtn");
addTaskBtn.addEventListener("click", function() {
  console.log("Add Task");
  // openAddTaskModal();
});

const taskCard = document.createElement("div");
taskCard.className = "task__card";
taskCard.dataset.id = taskCard.id;

taskCard.innterHTML = `
<div class="task__status">
  `

const truncateText = (text, maxLength) => {
  return text.length > maxLength
  ? text.substring(0, maxLength) + "..."
  : text;
}

function getPriorityColor(priority) {
  if (priority === "Extreme") {
    return "#e74c3c"
  } else if (priority === "Moderate") {
    return "#3498db"
  } else {
    return "#2ecc71";
  }
}