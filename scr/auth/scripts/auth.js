// Регистрация
// Хранилище пользователей
const users = JSON.parse(localStorage.getItem('users')) || [];

// Проверяем, какая форма есть на странице
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');

if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newUser = {
      id: Date.now(),
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      password: document.getElementById('password').value,
      joinDate: new Date().toISOString(),
      avatar: 'default-avatar.png'
    };

    // Проверка на существующего пользователя
    if (users.some(user => user.email === newUser.email)) {
      alert('Пользователь с таким email уже существует!');
      return;
    }

    // Сохранение
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Автоматический вход
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    window.location.href = '../auth/dashboard/index.html';
  });
}

// Логин
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const user = users.find(u => 
      u.email === email && u.password === password
    );
  
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      window.location.href = '../auth/dashboard/index.html';
    } else {
      alert('Неверный email или пароль!');
    }
  });
}

// Обработчик для ссылки выхода
document.addEventListener('DOMContentLoaded', () => {
  const logoutLink = document.getElementById('logoutLink');
  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('currentUser');
      window.location.href = '../login.html';
    });
  }
});