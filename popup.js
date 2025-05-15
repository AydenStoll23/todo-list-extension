let tasks = [];

// Load dark mode and tasks from storage
chrome.storage.local.get(['darkMode', 'tasks'], result => {
  if (result.darkMode === 'enabled') enableDarkMode();
  tasks = result.tasks || [];
  renderTasks();
});

document.getElementById('task-form').addEventListener('submit', e => {
  e.preventDefault();
  const taskInput = document.getElementById('task-input');
  const taskText = taskInput.value.trim();
  if (taskText) {
    tasks.push({ text: taskText, done: false, note: '', showNote: false });
    saveTasks();
    renderTasks();
    taskInput.value = '';
  }
});

document.getElementById('toggle-dark').addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  chrome.storage.local.set({ darkMode: isDark ? 'enabled' : 'disabled' });
});

function enableDarkMode() {
  document.body.classList.add('dark');
}

function saveTasks() {
  chrome.storage.local.set({ tasks });
}

function renderTasks() {
  const list = document.getElementById('task-list');
  list.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = task.done ? 'done' : '';

    const span = document.createElement('span');
    span.textContent = task.text;
    span.addEventListener('click', () => {
      tasks[index].done = !tasks[index].done;
      saveTasks();
      renderTasks();
    });

    const noteBtn = document.createElement('button');
    noteBtn.textContent = task.showNote ? 'Hide Note' : 'Add Note';
    noteBtn.className = 'note-btn';
    noteBtn.addEventListener('click', () => {
      tasks[index].showNote = !tasks[index].showNote;
      saveTasks();
      renderTasks();
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '❌';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    li.appendChild(span);
    li.appendChild(noteBtn);
    li.appendChild(deleteBtn);

    if (task.showNote) {
      const noteInput = document.createElement('input');
      noteInput.type = 'text';
      noteInput.placeholder = 'Add a note...';
      noteInput.value = task.note;
      noteInput.className = 'note-input';
      noteInput.addEventListener('input', e => {
        tasks[index].note = e.target.value;
        saveTasks();
      });
      li.appendChild(noteInput);
    }

    list.appendChild(li);
  });
}
