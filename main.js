/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/js/loadFromStorage.js
function loadFromStorage() {
  try {
    return JSON.parse(localStorage.getItem('state'));
  } catch (e) {
    throw new Error('Ошибка загрузки сохраненного списка задач');
  }
}
;// CONCATENATED MODULE: ./src/js/saveToStorage.js
function saveToStorage() {
  const taskBoardElement = document.body.querySelector('.board-wrapper');
  const taskBoardHtml = taskBoardElement.innerHTML;
  window.localStorage.setItem('state', JSON.stringify(taskBoardHtml));
}
;// CONCATENATED MODULE: ./src/js/setDragAndDropHandlers.js

let draggedItem;
let currentItem;
let shiftX;
let shiftY;

// Moving-task-item logic:
function itemDrag(event) {
  if (!draggedItem) return;
  if (!currentItem) return;

  // move-task-item
  draggedItem.style.left = `${event.pageX - shiftX}px`;
  draggedItem.style.top = `${event.pageY - shiftY}px`;

  // find-drop-target
  draggedItem.style.visibility = 'hidden';
  const closestTarget = document.elementFromPoint(event.clientX, event.clientY);
  draggedItem.style.visibility = '';
  if (!closestTarget) return;
  const targetDrop = closestTarget.closest('.items-task');
  const targetDropPanel = closestTarget.closest('.panel');

  // for-empty-task-item-list
  if (!targetDropPanel) return;
  const targetDropPanelList = targetDropPanel.querySelector('.items');
  if (!targetDropPanelList.children.length) {
    targetDropPanelList.prepend(currentItem);
  }

  // for-existed-task-item-list
  if (!targetDrop) return;
  if (targetDrop === currentItem) return;
  const {
    top
  } = targetDrop.getBoundingClientRect();
  if (event.pageY > window.scrollY + top + closestTarget.offsetHeight / 2) {
    closestTarget.after(currentItem);
  } else {
    closestTarget.before(currentItem);
  }
}

// Drop-task-item logic:
function itemDrop() {
  if (!draggedItem) return;
  if (!currentItem) return;
  draggedItem.classList.remove('dragged');
  document.body.removeChild(draggedItem);
  currentItem.classList.remove('droppable');
  currentItem.classList.remove('hidden');
  document.body.removeEventListener('mouseup', itemDrop);
  document.body.removeEventListener('mousemove', itemDrag);
  draggedItem = undefined;
  currentItem = undefined;
  shiftX = 0;
  shiftY = 0;

  // Save-after-drop-task-item logic:
  saveToStorage();
}

// Drag-task-item logic:
function setDragAndDropHandlers(panelItemsListLastChild) {
  panelItemsListLastChild.addEventListener('mousedown', event => {
    event.preventDefault();
    currentItem = event.target;
    if (!currentItem.classList.contains('items-task')) return;
    draggedItem = event.target.cloneNode(true);
    draggedItem.classList.add('dragged');
    document.body.appendChild(draggedItem);
    currentItem.classList.add('droppable');
    const {
      left,
      top
    } = currentItem.getBoundingClientRect();
    shiftX = event.clientX - left;
    shiftY = event.clientY - top + 10; // +10px иначе криво по Y курсор

    document.body.addEventListener('mouseup', itemDrop);
    document.body.addEventListener('mousemove', itemDrag);
    itemDrag(event);
  });
}
;// CONCATENATED MODULE: ./src/js/setHandlers.js



// Remove-existing-task-item logic:
function setItemRemoveHandlers(item) {
  if (!item || !item.classList.contains('items-task')) return;
  item.querySelector('.item-remove').addEventListener('click', event => {
    event.currentTarget.closest('.items-task').remove();
    // Save-after-remove-task-item logic:
    saveToStorage();
  });
  item.addEventListener('mouseenter', event => {
    event.currentTarget.querySelector('.item-remove').classList.remove('hidden');
  });
  item.addEventListener('mouseleave', event => {
    event.currentTarget.querySelector('.item-remove').classList.add('hidden');
  });
}

// Open-adding-task-item-form logic:
function setAddTaskButtonHandlers(addTasksItem, addTasksForm, newTaskTitle) {
  addTasksItem.addEventListener('click', () => {
    addTasksForm.classList.remove('hidden');
    addTasksItem.classList.add('hidden');
    newTaskTitle.focus();
  });
}

// Close-adding-task-item-form logic:
function setCancelAddTaskButtonHandlers(addTasksItem, addTasksForm, cancelTasksBtn) {
  cancelTasksBtn.addEventListener('click', () => {
    addTasksForm.classList.add('hidden');
    addTasksItem.classList.remove('hidden');
    // addTasksForm.reset();
  });
}

// New-task-item logic:
function setAddTaskSubmitHandlers(addTasksItem, addTasksForm, panelItemsList, newTaskTitle) {
  addTasksForm.addEventListener('submit', event => {
    event.preventDefault();
    // const inputText = event.target[0].value.trim(); // так тоже работает
    const inputText = newTaskTitle.value.trim();
    if (inputText === '') return;
    panelItemsList.insertAdjacentHTML('beforeEnd', `<li class="items-task">
        ${inputText}
          <div class="item-remove hidden">
            &times;
          </div>            
      </li>`);

    // event.target.reset(); // так тоже работает
    // addTasksForm.reset();
    // newTaskTitle.focus();
    addTasksForm.classList.add('hidden');
    addTasksItem.classList.remove('hidden');

    // Remove-task-item logic:
    setItemRemoveHandlers(panelItemsList.lastChild);

    // Moving-task-item logic:
    setDragAndDropHandlers(panelItemsList.lastChild);

    // Save-after-add-task-item logic:
    saveToStorage();
  });
}
;// CONCATENATED MODULE: ./src/js/app.js



document.addEventListener('DOMContentLoaded', () => {
  // loading saved state
  const loadedState = loadFromStorage();
  if (loadedState) {
    const taskBoardElement = document.body.querySelector('.board-wrapper');
    taskBoardElement.innerHTML = loadedState;
    const taskItems = taskBoardElement.querySelectorAll('.items-task');
    taskItems.forEach(item => {
      setItemRemoveHandlers(item);
      setDragAndDropHandlers(item);
    });
  }
  const board = document.body.querySelector('.board-wrapper');
  const panels = board.querySelectorAll('.panel');
  panels.forEach(panel => {
    const addTasksContainer = panel.querySelector('.add-tasks-container');
    const panelItemsList = panel.querySelector('.items');
    const addTasksForm = addTasksContainer.querySelector('.add-tasks-control');
    const newTaskTitle = addTasksForm.querySelector('.add-tasks-input');

    //  Show/hide-add-task-item logic
    const cancelTasksBtn = addTasksForm.querySelector('.add-tasks-cancel');
    const addTasksItem = panel.querySelector('.add-tasks-item');
    setAddTaskButtonHandlers(addTasksItem, addTasksForm, newTaskTitle);
    setCancelAddTaskButtonHandlers(addTasksItem, addTasksForm, cancelTasksBtn);

    //  Add-task-item logic:
    setAddTaskSubmitHandlers(addTasksItem, addTasksForm, panelItemsList, newTaskTitle);
  }); //  end of panels.forEach
}); // end of DOMContentLoaded
;// CONCATENATED MODULE: ./src/index.js



// TODO: write your code in app.js
/******/ })()
;