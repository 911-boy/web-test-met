// Панель управления

// Проверка авторизации
const currentUser = JSON.parse(localStorage.getItem('currentUser'));

if (!currentUser) {
  window.location.href = '../login.html';
}

// Заполнение данных профиля на странице dashboard/index.html
const userNameElement = document.getElementById('userName');
const userEmailElement = document.getElementById('userEmail');
const joinDateElement = document.getElementById('joinDate');
const avatarInputElement = document.getElementById('avatarInput');
const userAvatarElement = document.getElementById('userAvatar');
const logoutButton = document.getElementById('logout');
const editProfileButton = document.getElementById('editProfile');

// Проверяем, что элементы существуют (мы на странице dashboard/index.html)
if (userNameElement && userEmailElement && joinDateElement) {
  userNameElement.textContent = currentUser.name;
  userEmailElement.textContent = currentUser.email;
  joinDateElement.textContent = 
    new Date(currentUser.joinDate).toLocaleDateString();
}

// Обновление аватара
if (avatarInputElement && userAvatarElement) {
  // Установить текущий аватар
  if (currentUser.avatar) {
    userAvatarElement.src = currentUser.avatar;
  }
  
  avatarInputElement.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (event) => {
      currentUser.avatar = event.target.result;
      userAvatarElement.src = event.target.result;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      
      // Обновление в хранилище пользователей
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const index = users.findIndex(u => u.id === currentUser.id);
      if (index !== -1) {
        users[index] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
      }
    };
    
    reader.readAsDataURL(file);
  });
}

// Выход из системы
if (logoutButton) {
  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = '../login.html';
  });
}

// Переход на страницу редактирования профиля
if (editProfileButton) {
  editProfileButton.addEventListener('click', () => {
    window.location.href = 'profile.html';
  });
}

// Редактирование профиля на странице profile.html
const editProfileForm = document.getElementById('editProfileForm');
if (editProfileForm) {
  // Предзаполнение формы
  const editNameInput = document.getElementById('editName');
  if (editNameInput) {
    editNameInput.value = currentUser.name;
  }
  
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