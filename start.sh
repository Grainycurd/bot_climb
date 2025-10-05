#!/bin/bash

echo "🚀 Запуск Telegram Mini App для скалодрома"
echo "=========================================="

# Проверяем наличие Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не найден. Установите Node.js с https://nodejs.org"
    exit 1
fi

# Проверяем наличие npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm не найден. Установите npm"
    exit 1
fi

echo "✅ Node.js и npm найдены"

# Устанавливаем зависимости
echo "📦 Устанавливаем зависимости..."

# Корневые зависимости
npm install

# Зависимости фронтенда
cd frontend
npm install
cd ..

# Зависимости бэкенда
cd backend
npm install
cd ..

echo "✅ Все зависимости установлены"

# Создаем .env файл для бэкенда если его нет
if [ ! -f "backend/.env" ]; then
    echo "📝 Создаем файл .env для бэкенда..."
    cat > backend/.env << EOF
# Telegram Bot Configuration
BOT_TOKEN=your-telegram-bot-token-here

# Server Configuration
PORT=3001
NODE_ENV=development
EOF
    echo "⚠️  Не забудьте заменить BOT_TOKEN на реальный токен вашего бота!"
fi

echo ""
echo "🎉 Готово! Теперь вы можете:"
echo ""
echo "1. Запустить приложение:"
echo "   npm run dev"
echo ""
echo "2. Или запустить по отдельности:"
echo "   npm run dev:frontend  # http://localhost:3000"
echo "   npm run dev:backend   # http://localhost:3001"
echo ""
echo "3. Для продакшена:"
echo "   npm run build"
echo "   npm start"
echo ""
echo "📱 Для тестирования в Telegram:"
echo "1. Создайте бота через @BotFather"
echo "2. Получите токен и вставьте в backend/.env"
echo "3. Настройте Web App URL в боте"
echo ""
echo "🌐 Для деплоя:"
echo "- Frontend: Vercel (папка frontend)"
echo "- Backend: Render/Railway (папка backend)"
echo ""
echo "Удачи! 🧗‍♂️"

