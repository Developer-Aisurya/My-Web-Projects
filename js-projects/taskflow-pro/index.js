const themeToggle = document.getElementById("themeToggle");
const taskInput = document.getElementById("taskInput");
const dateInput = document.getElementById("dueDate");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".pill");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const emptyState = document.getElementById("emptyState");
const currentDateEl = document.getElementById("currentDate");

let tasks = JSON.parse(localStorage.getItem("proTasks")) || [];
let currentFilter = "all";

if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️";
}

currentDateEl.textContent = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', month: 'short', day: 'numeric' 
});

function updateProgress() {
    if (tasks.length === 0) {
        progressFill.style.width = "0%";
        progressText.textContent = "0%";
        return;
    }
    const completed = tasks.filter(t => t.completed).length;
    const percentage = Math.round((completed / tasks.length) * 100);
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `${percentage}%`;
}

function renderTasks() {
    taskList.innerHTML = "";
    const searchValue = searchInput.value.toLowerCase();

    const filtered = tasks.filter(t => {
        const matchesFilter = currentFilter === "all" || 
            (currentFilter === "completed" ? t.completed : !t.completed);
        const matchesSearch = t.theTask.toLowerCase().includes(searchValue);
        return matchesFilter && matchesSearch;
    });

    emptyState.style.display = filtered.length === 0 ? "block" : "none";

    filtered.forEach(task => {
        const li = document.createElement("li");
        li.className = `task ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <input type="checkbox" class="task-check" ${task.completed ? "checked" : ""}>
            <div style="flex:1; margin-left:12px">
                <span style="display:block; font-weight:500;">${task.theTask}</span>
                <small style="color:var(--text-secondary); font-size:0.75rem;">${task.theDate}</small>
            </div>
            <button class="delete-btn">🗑️</button>
        `;

        li.querySelector(".task-check").addEventListener("change", () => {
            tasks = tasks.map(t => t.id === task.id ? {...t, completed: !t.completed} : t);
            save();
        });

        li.querySelector(".delete-btn").addEventListener("click", () => {
            tasks = tasks.filter(t => t.id !== task.id);
            save();
        });

        taskList.appendChild(li);
    });
    updateProgress();
}

function save() {
    localStorage.setItem("proTasks", JSON.stringify(tasks));
    renderTasks();
}

addTaskBtn.addEventListener("click", () => {
    const val = taskInput.value.trim();
    const date = dateInput.value;

    if (val && date) {
        tasks.push({
            id: crypto.randomUUID(),
            theTask: val,
            theDate: date,
            completed: false
        });
        taskInput.value = "";
        dateInput.value = "";
        save();
    }
});

searchInput.addEventListener("input", renderTasks);

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark");
    themeToggle.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
});

renderTasks();
