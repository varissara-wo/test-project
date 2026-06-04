(function () {
  "use strict";

  const STORAGE_KEY = "todo-app.tasks";

  /** @type {{ id: string, text: string, completed: boolean }[]} */
  let tasks = load();
  let filter = "all";

  const form = document.getElementById("new-task-form");
  const input = document.getElementById("new-task-input");
  const list = document.getElementById("task-list");
  const count = document.getElementById("count");
  const filters = document.getElementById("filters");
  const clearCompleted = document.getElementById("clear-completed");

  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function addTask(text) {
    tasks.push({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      text: text,
      completed: false,
    });
    save();
    render();
  }

  function toggleTask(id) {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      task.completed = !task.completed;
      save();
      render();
    }
  }

  function deleteTask(id) {
    tasks = tasks.filter((t) => t.id !== id);
    save();
    render();
  }

  function visibleTasks() {
    if (filter === "active") return tasks.filter((t) => !t.completed);
    if (filter === "completed") return tasks.filter((t) => t.completed);
    return tasks;
  }

  function render() {
    list.innerHTML = "";

    const visible = visibleTasks();

    if (visible.length === 0) {
      const empty = document.createElement("li");
      empty.className = "empty";
      empty.textContent =
        filter === "all" ? "No tasks yet. Add one above!" : "Nothing here.";
      list.appendChild(empty);
    } else {
      visible.forEach((task) => list.appendChild(taskElement(task)));
    }

    const remaining = tasks.filter((t) => !t.completed).length;
    count.textContent = `${remaining} item${remaining === 1 ? "" : "s"} left`;
  }

  function taskElement(task) {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => toggleTask(task.id));

    const text = document.createElement("span");
    text.className = "text";
    text.textContent = task.text;

    const del = document.createElement("button");
    del.className = "delete";
    del.type = "button";
    del.setAttribute("aria-label", "Delete task");
    del.textContent = "×";
    del.addEventListener("click", () => deleteTask(task.id));

    li.append(checkbox, text, del);
    return li;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    addTask(text);
    input.value = "";
    input.focus();
  });

  filters.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-filter]");
    if (!btn) return;
    filter = btn.dataset.filter;
    filters
      .querySelectorAll("button")
      .forEach((b) => b.classList.toggle("active", b === btn));
    render();
  });

  clearCompleted.addEventListener("click", () => {
    tasks = tasks.filter((t) => !t.completed);
    save();
    render();
  });

  render();
})();
