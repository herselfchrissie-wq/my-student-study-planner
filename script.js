document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskTitleInput = document.getElementById('task-title');
    const taskSubjectInput = document.getElementById('task-subject');
    const taskList = document.getElementById('task-list');
    const emptyState = document.getElementById('empty-state');
    const errorMessage = document.getElementById('error-message');
    const totalCountEl = document.getElementById('total-count');
    const completedCountEl = document.getElementById('completed-count');

    // Load tasks from localStorage or initialize empty array
    let tasks = JSON.parse(localStorage.getItem('atu_study_tasks')) || [];

    // Render tasks on initial load
    renderTasks();

    // Handle form submission (Add Task)
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = taskTitleInput.value.trim();
        const subject = taskSubjectInput.value.trim() || 'General Study';

        // Validation check for blank title
        if (title === '') {
            if (errorMessage) errorMessage.style.display = 'block';
            taskTitleInput.focus();
            return;
        }
        
        if (errorMessage) errorMessage.style.display = 'none';

        const newTask = {
            id: Date.now(),
            title: title,
            subject: subject,
            completed: false
        };

        tasks.push(newTask);
        saveAndRender();

        // Reset input fields
        taskTitleInput.value = '';
        taskSubjectInput.value = '';
        taskTitleInput.focus();
    });

    // Handle actions inside task list (Complete / Delete)
    taskList.addEventListener('click', (e) => {
        const id = Number(e.target.dataset.id);

        if (e.target.classList.contains('btn-complete')) {
            toggleTaskCompletion(id);
        } else if (e.target.classList.contains('btn-delete')) {
            deleteTask(id);
        }
    });

    function toggleTaskCompletion(id) {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        saveAndRender();
    }

    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveAndRender();
    }

    function saveAndRender() {
        localStorage.setItem('atu_study_tasks', JSON.stringify(tasks));
        renderTasks();
    }

    function renderTasks() {
        taskList.innerHTML = '';

        // Update statistics counter
        const completedCount = tasks.filter(t => t.completed).length;
        if (totalCountEl) totalCountEl.textContent = tasks.length;
        if (completedCountEl) completedCountEl.textContent = completedCount;

        if (tasks.length === 0) {
            emptyState.classList.remove('hidden');
            return;
        } else {
            emptyState.classList.add('hidden');
        }

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <div class="task-details">
                    <span class="subject-badge">${escapeHTML(task.subject)}</span>
                    <span class="task-title">${escapeHTML(task.title)}</span>
                </div>
                <div class="task-actions">
                    <button class="btn-complete" data-id="${task.id}">
                        ${task.completed ? '✓ Done' : 'Mark Done'}
                    </button>
                    <button class="btn-delete" data-id="${task.id}">Delete</button>
                </div>
            `;
            taskList.appendChild(li);
        });
    }

    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
});