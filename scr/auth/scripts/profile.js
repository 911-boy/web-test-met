// Скрипт для страницы редактирования профиля

// Проверка авторизации
const currentUser = JSON.parse(localStorage.getItem('currentUser'));

if (!currentUser) {
  window.location.href = '../login.html';
}

// Предзаполнение формы
const editNameInput = document.getElementById('editName');
if (editNameInput) {
  editNameInput.value = currentUser.name;
}

// Обработка формы редактирования профиля
const editProfileForm = document.getElementById('editProfileForm');
if (editProfileForm) {
  editProfileForm.addEventListener('submit', (e) => {
    e.preventDefault();
  
    const newName = document.getElementById('editName').value;
    const newPassword = document.getElementById('newPassword').value;
  
    // Обновление данных
    currentUser.name = newName;
    if (newPassword) currentUser.password = newPassword;
  
    // Обновление в хранилищах
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const index = users.findIndex(u => u.id === currentUser.id);
    if (index !== -1) {
      users[index] = currentUser;
      localStorage.setItem('users', JSON.stringify(users));
    }
  
    alert('Изменения сохранены!');
    window.location.href = 'index.html';
  });
}

// Обработчик для ссылки выхода
const logoutLink = document.getElementById('logoutLink');
if (logoutLink) {
  logoutLink.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('currentUser');
    window.location.href = '../login.html';
  });
} 