// Utilitários de LocalStorage
const getTasksFromLocalStorage = () => {
    return JSON.parse(window.localStorage.getItem('tasks')) || [];
};

const setTasksInLocalStorage = (tasks) => {
    window.localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Renderiza progresso das tarefas
const renderTasksProgressData = (tasks) => {
    let tasksProgressDOM = document.getElementById('tasks-progress');
    if (!tasksProgressDOM) {
        tasksProgressDOM = document.createElement('div');
        tasksProgressDOM.id = 'tasks-progress';
        document.getElementById("todo-footer").appendChild(tasksProgressDOM);
    }
    const doneTasks = tasks.filter(task => task.done).length;
    tasksProgressDOM.textContent = `${doneTasks} concluídas`;
};

// Gera novo ID incremental
const getNewTaskId = () => {
    const tasks = getTasksFromLocalStorage();
    const lastId = tasks.length ? Number(tasks[tasks.length - 1].id) : 0;
    return lastId + 1;
};

// Cria dados da nova tarefa
const getNewTaskData = (event) => {
    const { description, etiqueta } = event.target.elements;
    return {
        id: getNewTaskId(),
        description: description.value,
        etiqueta: etiqueta.value,
        done: false,
        createdAt: new Date().toLocaleString('pt-BR')
    };
};

// Simula delay na criação da tarefa
const getCreatedTaskInfo = (event) => new Promise(resolve => {
    setTimeout(() => resolve(getNewTaskData(event)), 3000);
});

// Cria elemento visual da tarefa
const createTaskListItem = (task) => {
    const list = document.getElementById('todo-list');
    const toDo = document.createElement('li');
    toDo.id = task.id;

    // Container do conteúdo
    const contentContainer = document.createElement('div');
    contentContainer.style.display = 'flex';
    contentContainer.style.flexDirection = 'column';

    // Descrição
    const descriptionElement = document.createElement('span');
    descriptionElement.className = 'task-description';
    descriptionElement.textContent = task.description;
    contentContainer.appendChild(descriptionElement);

    // Etiqueta
    if (task.etiqueta) {
        const etiquetaElement = document.createElement('span');
        etiquetaElement.className = 'task-etiqueta';
        etiquetaElement.textContent = task.etiqueta;
        contentContainer.appendChild(etiquetaElement);

        const dateElement = document.createElement('span');
        dateElement.textContent = `Criado em: ${task.createdAt.split(',')[0]}`;
        dateElement.style.fontSize = '1.2rem';
        dateElement.style.color = '#666';
        dateElement.style.marginTop = '0.3rem';
        contentContainer.appendChild(dateElement);
    }

    // Botão concluir
    const buttonContainer = document.createElement("div");
    buttonContainer.className = 'button-container';

    const concludeBtn = document.createElement("button");
    concludeBtn.className = 'concluir-btn';
    concludeBtn.ariaLabel = 'Concluir tarefa';
    concludeBtn.textContent = task.done ? '✓' : 'Concluir';
    concludeBtn.style.display = 'flex';
    concludeBtn.style.alignItems = 'center';
    concludeBtn.style.justifyContent = 'center';
    concludeBtn.style.fontSize = task.done ? '1.5rem' : '1.4rem';
    concludeBtn.style.fontWeight = task.done ? 'bold' : 'normal';

    concludeBtn.onclick = () => {
        toDo.classList.toggle('task-concluida');
        concludeBtn.classList.toggle('concluido');
        descriptionElement.classList.toggle('text-taxado');

        concludeBtn.textContent = concludeBtn.classList.contains('concluido') ? '✓' : 'Concluir';
        concludeBtn.style.fontSize = concludeBtn.classList.contains('concluido') ? '1.5rem' : '1.4rem';
        concludeBtn.style.fontWeight = concludeBtn.classList.contains('concluido') ? 'bold' : 'normal';

        const tasks = getTasksFromLocalStorage();
        const updatedTasks = tasks.map(t =>
            Number(t.id) === Number(task.id) ? { ...t, done: !t.done } : t
        );
        setTasksInLocalStorage(updatedTasks);
        renderTasksProgressData(updatedTasks);
    };

    // Botão deletar (comentado)
    /*
    const deleteBtn = document.createElement("button");
    deleteBtn.className = 'excluir-btn';
    deleteBtn.textContent = 'Excluir';
    deleteBtn.style.background = '#e74c3c';
    deleteBtn.style.color = '#fff';
    deleteBtn.style.border = 'none';
    deleteBtn.style.padding = '0.5rem 1rem';
    deleteBtn.style.borderRadius = '4px';
    deleteBtn.style.cursor = 'pointer';
    deleteBtn.style.marginTop = '0.5rem';

    deleteBtn.onclick = () => {
        const tasks = getTasksFromLocalStorage();
        const updatedTasks = tasks.filter(t => Number(t.id) !== Number(task.id));
        setTasksInLocalStorage(updatedTasks);
        toDo.remove();
        renderTasksProgressData(updatedTasks);
    };

    buttonContainer.appendChild(deleteBtn);
    */

    buttonContainer.appendChild(concludeBtn);

    toDo.appendChild(contentContainer);
    toDo.appendChild(buttonContainer);
    list.appendChild(toDo);

    return toDo;
};

// Cria nova tarefa
const createTask = async (event) => {
    event.preventDefault();
    const saveBtn = document.getElementById('save-task');
    saveBtn.setAttribute('disabled', true);

    const newTaskData = await getCreatedTaskInfo(event);
    createTaskListItem(newTaskData);

    const tasks = getTasksFromLocalStorage();
    const updatedTasks = [...tasks, newTaskData];
    setTasksInLocalStorage(updatedTasks);
    renderTasksProgressData(updatedTasks);

    document.getElementById('description').value = '';
    saveBtn.removeAttribute('disabled');
};

// Inicialização
window.onload = () => {
    document.getElementById('create-todo-form').addEventListener('submit', createTask);

    const tasks = getTasksFromLocalStorage();
    tasks.forEach(createTaskListItem);
    renderTasksProgressData(tasks);
};
