document.addEventListener( //off scroll
    "wheel",
    function touchHandler(e) {
        if (e.ctrlKey) {
            e.preventDefault();
        }
    }, { passive: false });

const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
const listColumns = document.querySelectorAll('.drag-item-list');
const toDoList = document.getElementById('toDo-list');
const doingList = document.getElementById('doing-list');
const reviewList = document.getElementById('review-list');
const doneList = document.getElementById('done-list');

let updatedOnLoad = false;

let toDoListArray = [];
let doingListArray = [];
let reviewListArray = [];
let doneListArray = [];
let listArrays = [];

let draggedItem;
let dragging = false;
let currentColumn;

function getSavedColumns() {
    if (localStorage.getItem('toDoItems')) {
        toDoListArray = JSON.parse(localStorage.toDoItems);
        doingListArray = JSON.parse(localStorage.doingItems);
        reviewListArray = JSON.parse(localStorage.reviewItems);
        doneListArray = JSON.parse(localStorage.doneItems);
    } else {
        toDoListArray = ['Testing', 'Deployment'];
        doingListArray = ['Visual Elements'];
        reviewListArray = ['Content Creation'];
        doneListArray = ['Research', 'Sitemap'];
    }
}

function updateSavedColumns() {
    listArrays = [toDoListArray, doingListArray, reviewListArray, doneListArray];
    const arrayNames = ['toDo', 'doing', 'review', 'done'];
    arrayNames.forEach((arrayName, index) => {
        localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[index]));
    })
}

function filterArray(array) {
    const filteredArray = array.filter(item => item !== null);
    return filteredArray;
}

function createItemEl(columnEl, column, item, index) {

    const listEl = document.createElement('li');
    listEl.classList.add('drag-item');
    listEl.textContent = item;
    listEl.draggable = true;
    listEl.setAttribute('ondragstart', 'drag(event)');
    listEl.contentEditable = true;
    listEl.id = index;
    listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`);

    columnEl.appendChild(listEl);
}

function updateDOM() {
    if (!updatedOnLoad) {
        getSavedColumns();
    }
    toDoList.textContent = '';
    toDoListArray.forEach((toDoItem, index) => {
        createItemEl(toDoList, 0, toDoItem, index);
    });
    toDoListArray = filterArray(toDoListArray);

    doingList.textContent = '';
    doingListArray.forEach((doingItem, index) => {
        createItemEl(doingList, 1, doingItem, index);
    });
    doingListArray = filterArray(doingListArray);

    reviewList.textContent = '';
    reviewListArray.forEach((reviewItem, index) => {
        createItemEl(reviewList, 2, reviewItem, index);
    });
    reviewListArray = filterArray(reviewListArray);

    doneList.textContent = '';
    doneListArray.forEach((doneItem, index) => {
        createItemEl(doneList, 3, doneItem, index);
    });
    doneListArray = filterArray(doneListArray);

    updatedOnLoad = true;
    updateSavedColumns();
}

function updateItem(id, column) {
    const selectedArray = listArrays[column];
    const selectedColumnEl = listColumns[column].children;
    if (!dragging) {
        if (!selectedColumnEl[id].textContent) {
            delete selectedArray[id];
        } else {
            selectedArray[id] = selectedColumnEl[id].textContent;
        }
        updateDOM();
    }
}

function addToColumn(column) {
    const itemText = addItems[column].textContent;
    const selectedArray = listArrays[column];
    selectedArray.push(itemText);
    addItems[column].textContent = '';
    updateDOM();
}

function showInputBox(column) {
    addBtns[column].style.visibility = 'hidden';
    saveItemBtns[column].style.display = 'flex';
    addItemContainers[column].style.display = 'flex';
}

function hideInputBox(column) {
    addBtns[column].style.visibility = 'visible';
    saveItemBtns[column].style.display = 'none';
    addItemContainers[column].style.display = 'none';
    addToColumn(column);
}

function rebuildArrays() {
    toDoListArray = [];
    for (let i = 0; i < toDoList.children.length; i++) {
        toDoListArray.push(toDoList.children[i].textContent);
    }
    doingListArray = [];
    for (let i = 0; i < doingList.children.length; i++) {
        doingListArray.push(doingList.children[i].textContent);
    }
    reviewListArray = [];
    for (let i = 0; i < reviewList.children.length; i++) {
        reviewListArray.push(reviewList.children[i].textContent);
    }
    doneListArray = [];
    for (let i = 0; i < doneList.children.length; i++) {
        doneListArray.push(doneList.children[i].textContent);
    }
    updateDOM();
}

function drag(e) {
    draggedItem = e.target;
    dragging = true;
}

function allowDrop(e) {
    e.preventDefault();
}

function dragEnter(column) {
    listColumns[column].classList.add('over');
    currentColumn = column;
}

function drop(e) {
    e.preventDefault();
    listColumns.forEach((column) => {
        column.classList.remove('over');
    });
    const parent = listColumns[currentColumn];
    parent.appendChild(draggedItem);
    dragging = false;
    rebuildArrays();
}

updateDOM();