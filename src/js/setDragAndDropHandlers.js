import saveToStorage from './saveToStorage';

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

  const { top } = targetDrop.getBoundingClientRect();
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
export default function setDragAndDropHandlers(panelItemsListLastChild) {
  panelItemsListLastChild.addEventListener('mousedown', (event) => {
    event.preventDefault();

    currentItem = event.target;
    if (!currentItem.classList.contains('items-task')) return;

    draggedItem = event.target.cloneNode(true);
    draggedItem.classList.add('dragged');
    document.body.appendChild(draggedItem);
    currentItem.classList.add('droppable');
    const { left, top } = currentItem.getBoundingClientRect();
    shiftX = event.clientX - left;
    shiftY = event.clientY - top + 10; // +10px иначе криво по Y курсор

    document.body.addEventListener('mouseup', itemDrop);
    document.body.addEventListener('mousemove', itemDrag);
    itemDrag(event);
  });
}
