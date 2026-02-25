# StormCreate Website

Это современный сайт для Telegram-бота, включающий лендинг, блог и админ-панель. Сайт написан на чистом JavaScript (ES6+), HTML и Tailwind CSS, и использует Firebase в качестве backend-а (Firestore, Authentication).

## Особенности
- **Лендинг**: Привлекательный дизайн, анимации при скролле, переключение темной/светлой темы.
- **Блог**: Список постов с пагинацией, фильтрация по тегам, поиск.
- **Пост**: Поддержка Markdown, комментарии, счетчик просмотров и лайков.
- **Админка**: Защищена паролем. Позволяет создавать, редактировать, удалять посты и комментарии. Поддержка Markdown-редактора (SimpleMDE).

## Как настроить Firebase

1. Перейдите в [Firebase Console](https://console.firebase.google.com/).
2. Создайте новый проект.
3. Включите **Firestore Database** (создайте базу данных в тестовом режиме или настройте правила).
4. Включите **Authentication** и активируйте способ входа "Email/Password".
5. Зарегистрируйте веб-приложение в настройках проекта Firebase (иконка `</>`).
6. Скопируйте объект `firebaseConfig`.
7. Откройте файл `firebase-config.js` в корне проекта и замените содержимое на ваши данные:

```javascript
export const firebaseConfig = {
  apiKey: "ВАШ_API_KEY",
  authDomain: "ВАШ_PROJECT_ID.firebaseapp.com",
  projectId: "ВАШ_PROJECT_ID",
  storageBucket: "ВАШ_PROJECT_ID.appspot.com",
  messagingSenderId: "ВАШ_MESSAGING_SENDER_ID",
  appId: "ВАШ_APP_ID"
};
```

### Создание администратора
1. В Firebase Console перейдите в раздел **Authentication** -> **Users**.
2. Нажмите "Add user".
3. Введите email (например, `admin@example.com`) и пароль.
4. Теперь вы можете использовать эти данные для входа на странице `/admin.html`.

### Правила безопасности Firestore (Рекомендуемые)
Перейдите в Firestore -> Rules и вставьте:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Посты могут читать все, а изменять только авторизованные (админ)
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    // Комментарии могут читать и создавать все, удалять - только админ
    match /comments/{commentId} {
      allow read, create: if true;
      allow update, delete: if request.auth != null;
    }
  }
}
```

## Развертывание (Деплой)

Сайт полностью статический (не требует Node.js сервера для работы в продакшене), все запросы идут напрямую в Firebase.

### GitHub Pages
1. Создайте репозиторий на GitHub.
2. Загрузите все файлы проекта в репозиторий.
3. Перейдите в Settings -> Pages.
4. Выберите ветку `main` (или `master`) и папку `/root`.
5. Сохраните. Сайт будет доступен по ссылке.

### Netlify / Vercel
1. Зарегистрируйтесь на Netlify или Vercel.
2. Выберите "Deploy manually" (или подключите GitHub репозиторий).
3. Просто перетащите папку с проектом. Сайт будет развернут мгновенно.
