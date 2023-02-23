export default function loadFromStorage() {
  try {
    return JSON.parse(localStorage.getItem('state'));
  } catch (e) {
    throw new Error('Ошибка загрузки сохраненного списка задач');
  }
}
