# YT Summary AI

Интеллектуальная платформа для анализа и обработки контента с расширенными возможностями работы с видео и PDF-документами.

## Основные функции

- 🎥 **YouTube Video AI** - создание умных конспектов из YouTube видео
- 📄 **PDF AI** - извлечение ключевой информации из PDF документов
- 💬 **AI Chatbots** - интеграция с популярными мессенджерами (Discord, Telegram, Slack)
- 🌍 **Мультиязычность** - поддержка английского и украинского языков
- 👤 **Система аккаунтов** - регистрация, авторизация, управление подпиской

## Технологический стек

### Frontend

- React.js
- React Router для маршрутизации
- Redux Toolkit для управления состоянием
- Redux Persist для сохранения состояния
- i18next для интернационализации
- Axios для HTTP-запросов

### Backend & Services

- Firebase Authentication для аутентификации
- Firebase Firestore для базы данных
- Firebase Storage для хранения файлов
- LiqPay для обработки платежей

### Инфраструктура

- Create React App в качестве основы проекта
- Netlify для хостинга и CI/CD

## Установка и запуск

1. Клонируйте репозиторий
2. Установите зависимости:

```bash
npm install
```

3. Создайте файл .env на основе .env.example и заполните необходимые переменные окружения:

```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
REACT_APP_LIQPAY_PUBLIC_KEY=your_liqpay_key
REACT_APP_LIQPAY_PRIVATE_KEY=your_liqpay_private_key
REACT_APP_API_URL=your_api_url
```

4. Запустите проект:

```bash
npm start
```

## Особенности реализации

- Защищенные маршруты с авторизацией
- Интеграция платежной системы LiqPay

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
