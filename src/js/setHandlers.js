import saveToStorage from './saveToStorage';
import setDragAndDropHandlers from './setDragAndDropHandlers';

// Remove-existing-task-item logic:
export function setItemRemoveHandlers(item) {
  if (!item || !item.classList.contains('items-task')) return;

  item.querySelector('.item-remove').addEventListener('click', (event) => {
    event.currentTarget.closest('.items-task').remove();
    // Save-after-remove-task-item logic:
    saveToStorage();
  });

  item.addEventListener('mouseenter', (event) => {
    event.currentTarget.querySelector('.item-remove').classList.remove('hidden');
  });

  item.addEventListener('mouseleave', (event) => {
    event.currentTarget.querySelector('.item-remove').classList.add('hidden');
  });
}

// Open-adding-task-item-form logic:
export function setAddTaskButtonHandlers(addTasksItem, addTasksForm, newTaskTitle) {
  addTasksItem.addEventListener('click', () => {
    addTasksForm.classList.remove('hidden');
    addTasksItem.classList.add('hidden');
    newTaskTitle.focus();
  });
}

// Close-adding-task-item-form logic:
export function setCancelAddTaskButtonHandlers(addTasksItem, addTasksForm, cancelTasksBtn) {
  cancelTasksBtn.addEventListener('click', () => {
    addTasksForm.classList.add('hidden');
    addTasksItem.classList.remove('hidden');
    // addTasksForm.reset();
  });
}

// New-task-item logic:
export function setAddTaskSubmitHandlers(
  addTasksItem,
  addTasksForm,
  panelItemsList,
  newTaskTitle,
) {
  addTasksForm.addEventListener('submit', (event) => {
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
