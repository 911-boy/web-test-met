// Весь код оборачиваем в DOMContentLoaded для гарантии загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM полностью загружен');
  
  // Меню-бургер
  document.querySelector('.menu-toggle').addEventListener('click', () => {
      document.querySelector('.menu').classList.toggle('active');
  });

  // Форма заказа
  document.getElementById('form').addEventListener('submit', (e) => {
      e.preventDefault(); // Отменяем стандартную отправку
      
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      
      // Проверка телефона через регулярное выражение
      const phonePattern = /^\+7\d{10}$/;
      if (!phonePattern.test(data.phone)) {
          alert('Некорректный номер телефона!');
          return;
      }

      // Здесь можно добавить отправку данных на сервер
      console.log('Данные формы:', data);
      alert('Заявка отправлена! Мы свяжемся с вами в течение часа.');
  });

  // Слайдер
  let currentIndex = 0;
  const images = Array.from(document.querySelectorAll('.grid-container img'));

  // Открытие модалки при клике на изображение
  document.querySelectorAll('.grid-container img').forEach((img, index) => {
      img.addEventListener('click', () => {
          currentIndex = index;
          updateModalImage();
          document.getElementById('modal').style.display = 'block';
      });
  });

  // Закрытие через крестик
  document.querySelector('.modal-close').addEventListener('click', () => {
      document.getElementById('modal').style.display = 'none';
  });

  // Закрытие при клике вне изображения
  document.getElementById('modal').addEventListener('click', (e) => {
      if (e.target === document.getElementById('modal')) {
          document.getElementById('modal').style.display = 'none';
      }
  });

  // Закрытие на Escape
  document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
          document.getElementById('modal').style.display = 'none';
      }
  });

  // Кнопки навигации слайдера
  document.querySelector('.prev').addEventListener('click', (e) => {
    e.stopPropagation(); // Предотвращаем закрытие модального окна
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateModalImage();
  });

  document.querySelector('.next').addEventListener('click', (e) => {
    e.stopPropagation(); // Предотвращаем закрытие модального окна
    currentIndex = (currentIndex + 1) % images.length;
    updateModalImage();
  });

  function updateModalImage() {
    const modalImg = document.getElementById('modalImage');
    modalImg.src = images[currentIndex].src;
    modalImg.alt = `Изображение ${currentIndex + 1} из ${images.length}`;
  }

  // тёмная тема 
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme') || 'light';

  // Функция для обновления иконки в зависимости от темы
  function updateThemeIcon(theme) {
    themeToggle.innerHTML = theme === 'light' ? '🌙' : '☀️';
  }

  // Инициализация темы
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });

  // Отзывы
  // Загрузка комментариев
  let comments = JSON.parse(localStorage.getItem('comments') || '[]');

  // Функция для генерации уникального ID
  function generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  function renderComments() {
    const container = document.getElementById('comments-container');
    
    // Если комментариев нет, показываем сообщение
    if (comments.length === 0) {
      container.innerHTML = '<p class="no-comments">Пока нет отзывов. Будьте первым!</p>';
      return;
    }
    
    // Создаем HTML для всех комментариев
    let html = '';
    
    comments.forEach(comment => {
      html += `
        <div class="comment-item" data-id="${comment.id || generateId()}">
          <div class="comment-header">
            <h4>${comment.name}</h4>
            <button class="reply-btn" data-id="${comment.id || generateId()}">Ответить</button>
          </div>
          <p>${comment.text}</p>
          <small>${new Date(comment.date).toLocaleString()}</small>
          <div class="replies-container">
            ${renderReplies(comment.replies || [])}
          </div>
        </div>
      `;
    });
    
    container.innerHTML = html;
    
    // Добавляем обработчики для кнопок ответа
    document.querySelectorAll('.reply-btn').forEach(button => {
      button.addEventListener('click', handleReplyButtonClick);
    });
  }

  // Функция для рендеринга ответов
  function renderReplies(replies) {
    if (!replies || replies.length === 0) return '';
    
    let html = '';
    
    replies.forEach(reply => {
      html += `
        <div class="comment-item reply" data-id="${reply.id}">
          <div class="comment-header">
            <h4>${reply.name}</h4>
          </div>
          <p>${reply.text}</p>
          <small>${new Date(reply.date).toLocaleString()}</small>
        </div>
      `;
    });
    
    return html;
  }

  // Обработчик нажатия на кнопку "Ответить"
  function handleReplyButtonClick(e) {
    const commentId = e.target.dataset.id;
    const commentItem = e.target.closest('.comment-item');
    
    // Удаляем существующие формы ответа
    document.querySelectorAll('.reply-form').forEach(form => form.remove());
    
    // Создаем форму ответа
    const replyForm = document.createElement('form');
    replyForm.className = 'reply-form';
    replyForm.innerHTML = `
      <input type="text" class="reply-name" placeholder="Ваше имя" required>
      <textarea class="reply-text" placeholder="Ваш ответ" required></textarea>
      <div class="reply-buttons">
        <button type="submit" class="cta-button">Отправить</button>
        <button type="button" class="cancel-reply">Отмена</button>
      </div>
    `;
    
    // Добавляем обработчик отправки формы
    replyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleReplySubmit(e, commentId);
    });
    
    // Добавляем обработчик отмены
    replyForm.querySelector('.cancel-reply').addEventListener('click', () => {
      replyForm.remove();
    });
    
    // Вставляем форму после комментария
    const repliesContainer = commentItem.querySelector('.replies-container');
    repliesContainer.prepend(replyForm);
  }

  // Обработчик отправки ответа
  function handleReplySubmit(e, parentId) {
    const form = e.target;
    const nameInput = form.querySelector('.reply-name');
    const textInput = form.querySelector('.reply-text');
    
    const newReply = {
      id: generateId(),
      parentId: parentId,
      name: nameInput.value,
      text: textInput.value,
      date: new Date().toISOString()
    };
    
    // Находим родительский комментарий и добавляем ответ
    for (let i = 0; i < comments.length; i++) {
      if (comments[i].id === parentId) {
        if (!comments[i].replies) comments[i].replies = [];
        comments[i].replies.push(newReply);
        break;
      }
    }
    
    // Сохраняем и обновляем отображение
    localStorage.setItem('comments', JSON.stringify(comments));
    renderComments();
  }

  // Форма комментариев
  console.log('Проверяем форму комментариев');
  const commentForm = document.getElementById('comment-form');
  const submitButton = document.getElementById('comment-submit');
  console.log('Форма комментариев:', commentForm);
  console.log('Кнопка отправки:', submitButton);
  
  // Обработчик для кнопки отправки
  if (submitButton) {
    submitButton.addEventListener('click', function(e) {
      console.log('Клик по кнопке отправки!');
      e.preventDefault();
      
      const nameInput = document.getElementById('comment-name');
      const textInput = document.getElementById('comment-text');
      
      if (!nameInput.value || !textInput.value) {
        console.error('Не заполнены обязательные поля!');
        return;
      }
      
      console.log('Имя:', nameInput.value);
      console.log('Текст:', textInput.value);
      
      const comment = {
        id: generateId(),
        name: nameInput.value,
        text: textInput.value,
        date: new Date().toISOString(),
        replies: []
      };
      
      console.log('Новый комментарий:', comment);
      comments.push(comment);
      localStorage.setItem('comments', JSON.stringify(comments));
      renderComments();
      
      // Очищаем форму
      nameInput.value = '';
      textInput.value = '';
    });
  } else {
    console.error('Кнопка отправки не найдена!');
  }
  
  // Также сохраняем обработчик формы
  if (commentForm) {
    commentForm.addEventListener('submit', function(e) {
      console.log('Форма отправлена!');
      e.preventDefault();
      
      const nameInput = document.getElementById('comment-name');
      const textInput = document.getElementById('comment-text');
      console.log('Имя через форму:', nameInput ? nameInput.value : 'не найдено');
      console.log('Текст через форму:', textInput ? textInput.value : 'не найдено');
      
      const comment = {
        id: generateId(),
        name: nameInput.value,
        text: textInput.value,
        date: new Date().toISOString(),
        replies: []
      };
      
      console.log('Новый комментарий через форму:', comment);
      comments.push(comment);
      localStorage.setItem('comments', JSON.stringify(comments));
      renderComments();
      
      e.target.reset();
    });
  } else {
    console.error('Форма комментариев не найдена!');
  }
  
  // Первый рендер при загрузке страницы
  renderComments();
});