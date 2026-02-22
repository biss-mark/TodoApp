const addTask = document.querySelector('.add-task');
const showTask = document.querySelector('.show-task');
const boxFilter = document.querySelector('.box-filter');
const filter = document.querySelector('.filter');
const lists = document.querySelector('#lists');
const form = document.querySelector('#form');
function show_task() {
    addTask.style.display = "none";
    showTask.style.display = "block";
}
function hide_task() {
    addTask.style.display = "block";
    showTask.style.display = "none";
}
function show_filter() {
    boxFilter.style.display = "block";
    filter.style.display = "flex";
}
function box_filter() {
    boxFilter.style.display = "none";
    filter.style.display = "none";
}

let tasks = JSON.parse(localStorage.getItem("Task_Key")) || [];

let IdTask = tasks.length > 0 ? Math.max(...tasks.map(u => u.id)) + 1 : 1;

function save_task() {
    localStorage.setItem("Task_Key", JSON.stringify(tasks));
}

function show_all_task(listes = tasks) {
    lists.innerHTML = '';

    if (listes.length === 0) {
        lists.innerHTML = "<p class='center'>Aucune tache en cours !</p>";
        return;
    }

    listes.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <p>
                <span>${task.tache}</span>
                <small class="task-selected">${task.selected}</small>
            </p>
            <button class="del-task"><i class="bi bi-x"></i></button>
        `;

        const btnDelTask = li.querySelector('.del-task');
        btnDelTask.addEventListener('click', (event) => {
            event.stopPropagation();
            trash_task(task.id);
        });

        li.addEventListener('click', () => {
            task.actif = !task.actif;

            save_task();
            show_all_task();
        });

        if (task.actif) {
            li.classList.add('archived');
        }

        if (task.selected == 'Basse') {
            li.classList.add('success');
        } else if (task.selected == 'Moyenne') {
            li.classList.add('warning');
        } else if (task.selected == 'Urgente') {
            li.classList.add('danger');
        }

        lists.append(li);
    });
}

function add_new_task(tache, selected) {

    if (tasks.some(t => t.tache === tache)) {
        alert('Cette tache a déja été ajoutée !');
        return;
    }

    tasks.push({
        id: IdTask++,
        tache,
        selected,
        actif: false
    });

    alert('Tache ajoutée avec succes');

    save_task();
    show_all_task();
}

function trash_task(id) {
    tasks = tasks.filter(task_filter => task_filter.id !== id);

    save_task();
    show_all_task();
}

form.addEventListener('submit', (event) => {
    event.preventDefault();

    let tache = document.querySelector('#input-task').value;
    let selected = document.querySelector('#selected-task').value;

    if (tache.trim() == '') {
        alert('Remplissez tous les champs');
        return;
    }
    add_new_task(tache, selected);

    form.reset();

});

function task_basse() {
    const basse = tasks.filter(task => task.selected === "Basse");

    if (basse.length === 0) {
        lists.innerHTML = "<p class='center'>Aucune tache Basse en cours !</p>";
    } else {
        show_all_task(basse);
    }

    box_filter();
}
function task_moyenne() {
    const moyenne = tasks.filter(task_basse => task_basse.selected === "Moyenne");
    if (moyenne.length === 0) {
        lists.innerHTML = "<p class='center'>Aucune tache Moyenne en cours !</p>";
    } else {
        show_all_task(moyenne);
    }
    box_filter();
}
function task_urgente() {
    const urgente = tasks.filter(task_basse => task_basse.selected === "Urgente");
    if (urgente.length === 0) {
        lists.innerHTML = "<p class='center'>Aucune tache Urgente en cours !</p>";
    } else {
        show_all_task(urgente);
    }
    box_filter();
}
function task_archive() {
    const archive = tasks.filter(task_basse => task_basse.actif === true);
    if (archive.length === 0) {
        lists.innerHTML = "<p class='center'>Aucune tache Archivée en cours !</p>";
    } else {
        show_all_task(archive);
    }
    box_filter();
}
function task_all() {
    if (tasks.length === 0) {
        lists.innerHTML = "<p class='center'>Aucune tache en cours !</p>";
    } else {
        show_all_task();
    }
    box_filter();
}


show_all_task();