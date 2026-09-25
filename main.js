// AUREX Week 4 - Task Manager with localStorage

let tasks = JSON.parse(localStorage.getItem('aurex_tasks')) || [];
let currentFilter = 'all';
let editId = null;

const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const errorMsg = document.getElementById('errorMsg');
const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');
const filterBtns = document.querySelectorAll('.filter-btn');

function saveTasks(){
    localStorage.setItem('aurex_tasks', JSON.stringify(tasks));
}

function generateId(){
    return Date.now().toString();
}

function validateInput(v){
    if(!v || v.trim()===''){
        errorMsg.textContent='Task cannot be empty!';
        return false;
    }
    if(v.trim().length<3){
        errorMsg.textContent='Task must be at least 3 characters!';
        return false;
    }
    errorMsg.textContent='';
    return true;
}

taskForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const value = taskInput.value.trim();
    if(!validateInput(value)) return;

    if(editId){
        const t = tasks.find(t=>t.id===editId);
        if(t) t.text=value;
        editId=null;
        document.getElementById('addBtn').textContent='Add Task';
    } else {
        // Object + Array + let/const + template literal use
        tasks.push({
            id: generateId(),
            text: value,
            completed: false,
            createdAt: new Date().toISOString()
        });
    }
    saveTasks();
    taskInput.value='';
    renderTasks();
});

function renderTasks(){
    taskList.innerHTML='';
    let filtered = tasks;
    if(currentFilter==='active') filtered=tasks.filter(t=>!t.completed);
    if(currentFilter==='completed') filtered=tasks.filter(t=>t.completed);

    // for loop use
    for(let i=0; i<filtered.length; i++){
        const task = filtered[i];
        const li=document.createElement('li');
        li.className=`task-item ${task.completed?'completed':''}`;
        li.innerHTML=`
            <input type="checkbox" class="task-checkbox" ${task.completed?'checked':''} onchange="toggleComplete('${task.id}')">
            <span class="task-text">${task.text}</span>
            <div>
                <button class="edit-btn" onclick="editTask('${task.id}')">Edit</button>
                <button class="delete-btn" onclick="deleteTask('${task.id}')">Delete</button>
            </div>
        `;
        taskList.appendChild(li);
    }
    totalTasksEl.textContent=`Total: ${tasks.length}`;
    completedTasksEl.textContent=`Completed: ${tasks.filter(t=>t.completed).length}`;
}

function toggleComplete(id){
    const t=tasks.find(t=>t.id===id);
    if(t){
        t.completed=!t.completed;
        saveTasks();
        renderTasks();
    }
}

function deleteTask(id){
    if(confirm('Delete this task?')){
        tasks=tasks.filter(t=>t.id!==id);
        saveTasks();
        renderTasks();
    }
}

function editTask(id){
    const t=tasks.find(t=>t.id===id);
    if(t){
        taskInput.value=t.text;
        editId=id;
        document.getElementById('addBtn').textContent='Update Task';
        taskInput.focus();
    }
}

filterBtns.forEach(btn=>{
    btn.addEventListener('click',()=>{
        filterBtns.forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter=btn.dataset.filter;
        renderTasks();
    });
});

taskInput.addEventListener('input',()=>{
    if(taskInput.value.trim()) errorMsg.textContent='';
});

renderTasks();