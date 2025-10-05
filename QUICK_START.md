# 🚀 Быстрый старт - Telegram Mini App для скалодрома

## ✅ Что уже готово

Создано полнофункциональное Telegram Mini App со всеми запрошенными функциями:

### 🎯 Основные экраны:
- **Главный экран** - приветствие пользователя и навигация
- **📅 Запись на тренировку** - форма с выбором типа (групповая/индивидуальная)
- **🧗 Посмотреть трассы** - каталог с фильтрацией по сложности (5а-8с)
- **🕒 Расписание** - время работы и сетка занятий
- **💳 Абонементы и цены** - тарифы с кнопкой покупки
- **🏆 Мои достижения** - личные достижения и очки
- **📰 Новости и события** - анонсы и акции
- **📍 Контакты и адрес** - адрес, телефон, соцсети

### 🛠 Технические особенности:
- ✅ **Telegram WebApp API** - полная интеграция
- ✅ **Авторизация** - HMAC-SHA256 проверка подписи
- ✅ **Современный UI** - в стиле Telegram Mini Apps
- ✅ **Плавные анимации** - Framer Motion переходы
- ✅ **Адаптивный дизайн** - максимум 480px, отступы 16px
- ✅ **Темы** - автоматическое следование системной теме
- ✅ **CORS** - настроен для деплоя
- ✅ **Готов к деплою** - Vercel + Render

## 🚀 Запуск за 3 шага

### 1. Установка зависимостей
```bash
# Автоматическая установка всех зависимостей
./start.sh

# Или вручную:
npm install
cd frontend && npm install
cd ../backend && npm install
```

### 2. Настройка Telegram бота
```bash
# Создайте файл .env в папке backend
echo "BOT_TOKEN=your-telegram-bot-token-here" > backend/.env
echo "PORT=3001" >> backend/.env
echo "NODE_ENV=development" >> backend/.env
```

### 3. Запуск приложения
```bash
# Запуск фронтенда и бэкенда одновременно
npm run dev

# Фронтенд: http://localhost:3000
# Бэкенд: http://localhost:3001
```

## 📱 Настройка в Telegram

1. **Создайте бота** через @BotFather
2. **Получите токен** и вставьте в `backend/.env`
3. **Настройте Web App**:
   - Команда: `/newapp`
   - URL: `https://your-app-domain.vercel.app`
4. **Настройте меню**:
   - Команда: `/setmenubutton`
   - Кнопка: "Открыть приложение"

## 🌐 Деплой в продакшен

### Frontend (Vercel):
1. Подключите GitHub репозиторий
2. Root Directory: `frontend`
3. Build Command: `npm run build`
4. Output Directory: `dist`

### Backend (Render):
1. Подключите GitHub репозиторий
2. Root Directory: `backend`
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Environment Variable: `BOT_TOKEN`

## 📁 Структура проекта

```
bot2/
├── frontend/                 # React приложение
│   ├── src/
│   │   ├── App.jsx          # Основной компонент с экранами
│   │   ├── main.jsx         # Точка входа
│   │   └── index.css        # Стили в стиле Telegram
│   ├── package.json
│   └── vite.config.js
├── backend/                  # Express сервер
│   ├── index.js             # Основной сервер с API
│   ├── data/
│   │   └── sample-data.js   # Примеры данных
│   └── package.json
├── README.md                # Подробная документация
├── TELEGRAM_SETUP.md        # Настройка Telegram бота
├── start.sh                 # Скрипт быстрого запуска
├── vercel.json              # Конфигурация Vercel
└── render.yaml              # Конфигурация Render
```

## 🎨 UI/UX особенности

- **Telegram стиль** - автоматическое следование темам
- **Мобильная оптимизация** - максимум 480px ширина
- **Плавные анимации** - переходы между экранами
- **Крупные кнопки** - удобно для мобильных
- **Системные шрифты** - нативный вид

## 🔧 API Endpoints

- `POST /api/auth` - авторизация через Telegram
- `POST /api/booking` - запись на тренировку
- `GET /api/routes` - получение трасс с фильтрами
- `GET /api/schedule` - расписание занятий
- `GET /api/pricing` - тарифы и цены
- `GET /api/news` - новости и события
- `GET /api/contacts` - контактная информация
- `GET /api/achievements/:userId` - достижения пользователя

## 🐛 Решение проблем

### Ошибка "Unauthorized"
- Проверьте токен бота в `backend/.env`
- Убедитесь, что URL в настройках бота правильный

### CORS ошибки
- Проверьте настройки CORS в `backend/index.js`
- Добавьте ваш фронтенд URL в allowed origins

### Приложение не открывается
- Проверьте Web App URL в настройках бота
- Убедитесь, что фронтенд доступен

## 📞 Поддержка

- 📖 **README.md** - полная документация
- 🤖 **TELEGRAM_SETUP.md** - настройка бота
- 🚀 **start.sh** - автоматический запуск

---

**Готово к использованию! 🎉**

Просто запустите `./start.sh` и следуйте инструкциям!



