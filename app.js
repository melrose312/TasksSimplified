let tasks = [...sampleTasks]
let editingTaskId = null

const taskModal = document.getElementById("taskModal")
const modalTitle = document.getElementById("modalTitle")
const taskTitleInput = document.getElementById("taskTitle")
const taskDateInput = document.getElementById("taskDate")
const taskDescriptionInput = document.getElementById("taskDescription")
const saveTaskBtn = document.getElementById("saveTaskBtn")
const tasksWrapper = document.querySelector(".tasks__wrapper")
const taskDetailsPanel = document.querySelector(".task__details")
const addTaskBtn = document.getElementById("addTaskBtn")
const closeModalBtn = document.getElementById("closeModalBtn")
const searchInput = document.querySelector(".search__input")
const searchButton = document.querySelector(".search__button")

document.addEventListener("DOMContentLoaded", function () {
  // Set current date in header
  updateCurrentDate()

  // Render initial tasks
  renderTasks()

  // Select first task by default
  if (tasks.length > 0) {
    selectTask(tasks[0].id)
  } else {
    showEmptyState()
  }
})

// Add event listeners to action buttons
document.getElementById("editCurrentTaskBtn")
document.addEventListener("click", () => openEditTaskModal(taskId))
document.getElementById("deleteCurrentTaskBtn")
document.addEventListener("click", () => deleteTask(taskId))

// Event Listeners
addTaskBtn.addEventListener("click", openAddTaskModal)
closeModalBtn.addEventListener("click", closeModal)
saveTaskBtn.addEventListener("click", saveTask)
searchInput.addEventListener("input", searchTasks)
searchButton.addEventListener("click", searchTasks)

// Close modal when clicking outside
window.addEventListener("click", function (event) {
  if (event.target === taskModal) {
    closeModal()
  }
})

// Render tasks in the task list
function renderTasks() {
  tasksWrapper.innerHTML = ""

  if (tasks.length === 0) {
    showEmptyState()
    return
  }

  tasks.forEach((task) => {
    const taskCard = createTaskCard(task)
    tasksWrapper.appendChild(taskCard)
  })
}
// Create new element
function createTaskCard(task) {
  const taskCard = document.createElement("div")
  // Set attributes
  taskCard.className = "task__card"
  taskCard.dataset.id = task.id

  // Create the task card content
  taskCard.innerHTML = `<div class ="task__status">
  <div class="status__circle ${task.completed ? "completed" : ""}">
    <svg xmlns ="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${task.completed ? "white" : "currentColor"}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
  </div>
  <div class="task__title">${task.title}</div>
</div>
<div class="task__description">${truncateText(task.description, 100)}</div>
<div class="task__info">
<span class="priority__info">Priority: <span class = "${task.priority.toLowerCase()}">${task.priority}</span></span>
<span class="date__info"> Created on: ${task.date}</span></div>`

  // Add click event to select this task
  taskCard.addEventListener("click", () => selectTask(task.id))

  // add click event to toggle completion status
  const statusCircle = taskCard.querySelector(".status__circle")
  statusCircle.addEventListener("click", (event) => {
    event.stopPropagation()
    toggleTaskCompletion(task.id)
  })

  return taskCard
}

function selectTask(taskId) {
  // Deselect all tasks
  document.querySelectorAll(".task__card").forEach((card) => {
    card.classList.remove("selected")
  })

  // Select the clicked task
  const taskCard = document.querySelector(`.task__card[data-id="${taskId}"]`)
  if (taskCard) {
    taskCard.classList.add("selected")
  }
  // Find the task data
  const task = tasks.find((taskItem) => taskItem.id === taskId)
  if (!task) return

  taskDetailsPanel.innerHTML = `
  <div class="task__detail--header">
  <h2>${task.title}</h2>
  <div class="detail__meta">
  <div class="detail__meta--item">
  <span class="meta__label">Priority:</span>
  <span class="${task.priority.toLowerCase()}"><${task.priority}</span>
  </div>
  <div class="detail__meta--item">
  <span class="meta__label"> Created on:</span>
  <span><${task.date}</span>
  </div>
  </div>
  </div>

  <div class="detail__description">
  <p>${task.description}</p>
  </div>

  <div class="action__buttons">
  <button class="action__btn btn__secondary" id="editCurrentTaskBtn">
  <svg></svg></button>
  <button class="action__btn btn__primary" id="deleteCurrentTaskBtn"
  <svg></svg></button>
  </div>
  `
}

function updateCurrentDate() {
  const now = new Date()
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thurdsay",
    "Friday",
    "Saturday",
  ]
  const dayName = days[now.getDay()]

  // Format as MM/DD/YYYY
  const day = String(now.getDate()).padStart(2, "0")
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const year = now.getFullYear()
  const formattedDate = `${month}/${day}/${year}`

  document.getElementById("currentDay").textContent = dayName
  document.getElementById("currentDate").textContent = formattedDate
}

// Toggle task completion status
function toggleTaskCompletion(taskId) {
  const taskIndex = tasks.findIndex((task) => task.id === taskId)
  if (taskIndex !== -1) {
    tasks[taskIndex].completed = !tasks[taskIndex].completed

    // Update the UI
    const statusCircle = document.querySelector(
      `.task__card[data-id="${taskId}"] .status__circle`,
    )
    if (statusCircle) {
      statusCircle.classList.toggle("completed")
    }
    selectTask(taskId)
  }
}

// Open modal to add a new task
function openAddTaskModal() {
  //Reset form
  editingTaskId = null
  modalTitle.textContent = "Add New Task"
  taskTitleInput.value = ""
  taskDescriptionInput.value = ""

  //set current date
  const now = new Date()
  const day = String(now.getDate()).padStart(2, "0")
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const year = now.getFullYear()
  taskDateInput.value = `${month}/${day}/${year}`

  //Set default priority (Low)
  document.querySelectorAll('input[name="priority"]').forEach((radio) => {
    radio.checked = radio.value === "low"
  })

  // Show modal
  taskModal.style.display = "flex"
}

function openEditTaskModal(taskId) {
  const task = tasks.find((t) => t.id === taskId)
  if (!task) return

  //Set form values from task
  editingTaskId = taskId
  modalTitle.textContent = "Edit Task"
  taskTitleInput.value = task.title
  taskDateInput.value = task.date
  taskDescriptionInput.value = task.description

  //Set priority radio button
  document.querySelectorAll('input[name="priority"]').forEach((radio) => {
    radio.checked = radio.value.toLowerCase() === task.priority.toLowerCase()
  })

  //Show modal
  taskModal.style.display = "flex"
}

function closeModal() {
  taskModal.style.display = "none"
}

//Save task (add new or update existing)
function saveTask() {
  if (!taskTitleInput.value.trim()) {
    alert("Please enter a task title")
    return
  }

  //Get selected priority
  let selectedPriority = "Low"
  document.querySelectorAll('input[name="priority"]').forEach((radio) => {
    if (radio.checked) {
      selectedPriority =
        radio.value.charAt(0).toUpperCase() + radio.value.slice(1)
    }
  })

  if (editingTaskId === null) {
    //Add New Task
    const newTask = {
      id: Date.now(), //Use timestamp as unique ID
      title: taskTitleInput.value.trim(),
      description: taskDescriptionInput.value.trim(),
      priority: selectedPriority,
      date: taskDateInput.value,
      completed: false,
    }
    // Add to the beginning of tasks array
    tasks.unshift(newTask)

    //Render tasks and select the new one
    renderTasks()
    selectTask(newTask.id)
  } else {
    // Update existing task
    const taskIndex = tasks.findIndex((t) => t.id === editingTaskId)
    if (taskIndex !== -1) {
      tasks[taskIndex].title = taskTitleInput.value.trim()
      tasks[taskIndex].description = taskDescriptionInput.value.trim()
      tasks[taskIndex].priority = selectedPriority
      tasks[taskIndex].date = taskDateInput.value

      //Render tasks and select the updated one
      renderTasks()
      selectTask(editingTaskId)
    }
  }
  closeModal()
}

// Delete a task
function deleteTask(taskId) {
  //Confirm deletion
  if (!confirm("Are you sure you want to delete this task?")) return

  //Find the task index
  const taskIndex = tasks.findIndex((t) => t.id === taskId)
  if (taskIndex === -1) return

  //Remove the task
  tasks.splice(taskIndex, 1)

  renderTasks()

  // Select another task or show empty state
  if (tasks.length > 0) {
    selectTask(tasks[0].id)
  } else {
    showEmptyState()
  }
}

//Toggle task completion status
function toggleTaskCompletion(taskId) {
  const taskIndex = tasks.findIndex((t) => t.id === taskId)
  if (taskIndex !== -1) {
    tasks[taskIndex].completed = !tasks[taskIndex.completed]

    //Update the UI
    const statusCircle = document.querySelector(
      `.task__card[data-id="${taskId}"] . status__circle`,
    )
    if (statusCircle) {
      statusCircle.classList.toggle("completed")
    }
    selectedTask(taskId)
  }
}

//Search tasks by title
function searchTasks() {
  const searchTerm = searchInput.value.toLowerCase().trim()

  if (searchTerm === "") {
    renderTasks()
    if (tasks.length > 0) {
      selectTask(tasks[0].id)
    }
    return;
  }

  // Filter tasks by title
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm),
  )

  if (filteredTasks.length === 0) {
    //Show no results message
    tasksWrapper.innerHTML = `
    <div class="empty__state">
    <p>No tasks match your search.</p>
    </div>`
    taskDetailsPanel.innerHTML = ""
  } else {
    //show filtered results
    tasksWrapper.innerHTML = ""
    filteredTasks.forEach((task) => {
      const taskCard = createTaskCard(task)
      tasksWrapper.appendChild(taskCard)
    })
    selectTask(filteredTasks[0].id)
  }
}

// Arrow function with parameters and return value
const truncateText = (text, maxLength) => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
}

// Show empty state when no tasks
function showEmptyState() {
  tasksWrapper.innterHTML = `
  <div class="empty__state">
  <p>No tasks to show. Please add a task.</p>
  </div>`

  //Clear the details panel
  taskDetailsPanel.innerHTML = ""
}

function getPriorityColor(priority) {
  if (priority === "Extreme") {
    return "#e74c3c" //Red for extreme priority
  } else if (priority === "Moderate") {
    return "#3498db" //Blue for moderate priority
  } else {
    return "#2ecc71" //Green for low priority
  }
}
