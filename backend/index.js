import express from 'express'
import cors from 'cors'
import crypto from 'crypto'
import dotenv from 'dotenv'
import multer from 'multer'
import sharp from 'sharp'
import Jimp from 'jimp'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'), false)
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
})

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-frontend-domain.vercel.app'],
  credentials: true
}))
app.use(express.json())
app.use('/uploads', express.static('uploads'))

// Computer Vision функции для распознавания зацепок
async function detectHolds(imagePath) {
  try {
    const image = await Jimp.read(imagePath)
    const { width, height } = image.bitmap
    
    // Конвертируем в HSV для лучшего распознавания цветов
    const holds = []
    
    // Ищем зацепки по цветам (красный, синий, зеленый, желтый)
    const colors = [
      { name: 'red', hMin: 0, hMax: 10, sMin: 50, vMin: 50 },
      { name: 'blue', hMin: 200, hMax: 260, sMin: 50, vMin: 50 },
      { name: 'green', hMin: 80, hMax: 140, sMin: 50, vMin: 50 },
      { name: 'yellow', hMin: 40, hMax: 80, sMin: 50, vMin: 50 }
    ]
    
    for (let y = 0; y < height; y += 5) {
      for (let x = 0; x < width; x += 5) {
        const pixel = Jimp.intToRGBA(image.getPixelColor(x, y))
        const hsv = rgbToHsv(pixel.r, pixel.g, pixel.b)
        
        for (const color of colors) {
          if (isColorMatch(hsv, color)) {
            // Проверяем, что это не дубликат
            const isDuplicate = holds.some(hold => 
              Math.abs(hold.x - x) < 20 && Math.abs(hold.y - y) < 20
            )
            
            if (!isDuplicate) {
              holds.push({
                x: x,
                y: y,
                color: color.name,
                confidence: calculateConfidence(hsv, color)
              })
            }
          }
        }
      }
    }
    
    return holds
  } catch (error) {
    console.error('Error detecting holds:', error)
    return []
  }
}

function rgbToHsv(r, g, b) {
  r /= 255
  g /= 255
  b /= 255
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const diff = max - min
  
  let h = 0
  if (diff !== 0) {
    if (max === r) h = ((g - b) / diff) % 6
    else if (max === g) h = (b - r) / diff + 2
    else h = (r - g) / diff + 4
  }
  h = Math.round(h * 60)
  if (h < 0) h += 360
  
  const s = max === 0 ? 0 : diff / max
  const v = max
  
  return { h, s: s * 100, v: v * 100 }
}

function isColorMatch(hsv, colorRange) {
  return hsv.h >= colorRange.hMin && 
         hsv.h <= colorRange.hMax && 
         hsv.s >= colorRange.sMin && 
         hsv.v >= colorRange.vMin
}

function calculateConfidence(hsv, colorRange) {
  const hDiff = Math.abs(hsv.h - (colorRange.hMin + colorRange.hMax) / 2)
  const sDiff = Math.abs(hsv.s - 75) // Идеальная насыщенность
  const vDiff = Math.abs(hsv.v - 75) // Идеальная яркость
  
  return Math.max(0, 100 - (hDiff + sDiff + vDiff) / 3)
}

// Функция для проверки подписи Telegram
function verifyTelegramWebAppData(initData, botToken) {
  try {
    const urlParams = new URLSearchParams(initData)
    const hash = urlParams.get('hash')
    urlParams.delete('hash')
    
    const dataCheckString = Array.from(urlParams.entries())
      .map(([key, value]) => `${key}=${value}`)
      .sort()
      .join('\n')
    
    const secretKey = crypto.createHash('sha256').update(botToken).digest()
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex')
    
    return calculatedHash === hash
  } catch (error) {
    console.error('Error verifying Telegram data:', error)
    return false
  }
}

// Маршрут авторизации
app.post('/api/auth', (req, res) => {
  try {
    const { initData, user } = req.body
    
    if (!initData || !user) {
      return res.status(400).json({
        ok: false,
        error: 'Missing initData or user data'
      })
    }
    
    // Проверяем подпись Telegram (в продакшене используйте реальный токен бота)
    const botToken = process.env.BOT_TOKEN || 'your-bot-token'
    const isValid = verifyTelegramWebAppData(initData, botToken)
    
    if (!isValid) {
      return res.status(401).json({
        ok: false,
        error: 'Unauthorized'
      })
    }
    
    // Возвращаем данные пользователя
    res.json({
      ok: true,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        language_code: user.language_code
      }
    })
  } catch (error) {
    console.error('Auth error:', error)
    res.status(500).json({
      ok: false,
      error: 'Internal server error'
    })
  }
})

// Маршрут для записи на тренировку
app.post('/api/booking', (req, res) => {
  try {
    const { name, phone, date, time, type } = req.body
    
    // Здесь должна быть логика сохранения записи в базу данных
    console.log('New booking:', { name, phone, date, time, type })
    
    res.json({
      ok: true,
      message: 'Запись успешно создана'
    })
  } catch (error) {
    console.error('Booking error:', error)
    res.status(500).json({
      ok: false,
      error: 'Failed to create booking'
    })
  }
})

// Маршрут для получения секторов
app.get('/api/sectors', (req, res) => {
  try {
    const sectors = [
      {
        id: 1,
        name: 'Сектор 1',
        photoUrl: '/sectors/1.jpg',
        routeCount: 8
      },
      {
        id: 2,
        name: 'Сектор 2', 
        photoUrl: '/sectors/2.jpg',
        routeCount: 12
      },
      {
        id: 3,
        name: 'Сектор 3',
        photoUrl: '/sectors/3.jpg',
        routeCount: 6
      },
      {
        id: 4,
        name: 'Сектор 4',
        photoUrl: '/sectors/4.jpg',
        routeCount: 10
      },
      {
        id: 5,
        name: 'Сектор 5',
        photoUrl: '/sectors/5.jpg',
        routeCount: 7
      },
      {
        id: 6,
        name: 'Сектор 6',
        photoUrl: '/sectors/6.jpg',
        routeCount: 9
      }
    ]
    
    res.json({
      ok: true,
      sectors
    })
  } catch (error) {
    console.error('Sectors error:', error)
    res.status(500).json({
      ok: false,
      error: 'Failed to get sectors'
    })
  }
})

// Маршрут для получения трасс в секторе
app.get('/api/sectors/:sectorId/routes', (req, res) => {
  try {
    const { sectorId } = req.params
    
    // Имитация трасс с координатами зацепок
    const routes = [
      {
        id: 1,
        category: '6а',
        setter: 'Свиридов',
        color: 'red',
        holds: [
          { x: 120, y: 200 },
          { x: 150, y: 250 },
          { x: 180, y: 300 },
          { x: 200, y: 350 }
        ]
      },
      {
        id: 2,
        category: '7а',
        setter: 'Петров',
        color: 'blue',
        holds: [
          { x: 80, y: 180 },
          { x: 110, y: 220 },
          { x: 140, y: 280 },
          { x: 170, y: 320 }
        ]
      },
      {
        id: 3,
        category: '5в',
        setter: 'Иванов',
        color: 'green',
        holds: [
          { x: 200, y: 150 },
          { x: 230, y: 200 },
          { x: 260, y: 250 },
          { x: 290, y: 300 }
        ]
      }
    ]
    
    res.json({
      ok: true,
      routes
    })
  } catch (error) {
    console.error('Sector routes error:', error)
    res.status(500).json({
      ok: false,
      error: 'Failed to get sector routes'
    })
  }
})

// Маршрут для получения трасс (старый endpoint для совместимости)
app.get('/api/routes', (req, res) => {
  try {
    const { difficulty, sector } = req.query
    
    // Здесь должна быть логика получения трасс из базы данных
    const routes = [
      { id: 1, name: 'Трасса "Старт"', difficulty: '5а', sector: 'Основной зал', image: '/route1.jpg' },
      { id: 2, name: 'Трасса "Вызов"', difficulty: '6а', sector: 'Основной зал', image: '/route2.jpg' },
      { id: 3, name: 'Трасса "Мастер"', difficulty: '7а', sector: 'Сектор А', image: '/route3.jpg' },
      { id: 4, name: 'Трасса "Эксперт"', difficulty: '8а', sector: 'Сектор Б', image: '/route4.jpg' }
    ]
    
    let filteredRoutes = routes
    
    if (difficulty && difficulty !== 'all') {
      filteredRoutes = filteredRoutes.filter(route => route.difficulty === difficulty)
    }
    
    if (sector) {
      filteredRoutes = filteredRoutes.filter(route => route.sector === sector)
    }
    
    res.json({
      ok: true,
      routes: filteredRoutes
    })
  } catch (error) {
    console.error('Routes error:', error)
    res.status(500).json({
      ok: false,
      error: 'Failed to get routes'
    })
  }
})

// Маршрут для получения расписания
app.get('/api/schedule', (req, res) => {
  try {
    const schedule = [
      { time: '09:00-10:00', activity: 'Детская группа (5-8 лет)', type: 'group' },
      { time: '10:00-11:00', activity: 'Детская группа (9-12 лет)', type: 'group' },
      { time: '11:00-12:00', activity: 'Йога для скалолазов', type: 'yoga' },
      { time: '14:00-15:00', activity: 'Взрослая группа (начинающие)', type: 'group' },
      { time: '15:00-16:00', activity: 'Взрослая группа (продвинутые)', type: 'group' },
      { time: '18:00-19:00', activity: 'Мастер-класс по технике', type: 'masterclass' },
      { time: '19:00-20:00', activity: 'Свободное лазание', type: 'free' }
    ]
    
    res.json({
      ok: true,
      schedule
    })
  } catch (error) {
    console.error('Schedule error:', error)
    res.status(500).json({
      ok: false,
      error: 'Failed to get schedule'
    })
  }
})

// Маршрут для получения цен
app.get('/api/pricing', (req, res) => {
  try {
    const pricing = [
      { id: 1, name: 'Разовое посещение', price: 800, description: 'Одно посещение в любое время' },
      { id: 2, name: 'Абонемент на месяц', price: 4000, description: 'Безлимитные посещения' },
      { id: 3, name: 'Абонемент на 3 месяца', price: 10000, description: 'Скидка 17%' },
      { id: 4, name: 'Семейный абонемент', price: 6000, description: 'Для 2 взрослых + дети' }
    ]
    
    res.json({
      ok: true,
      pricing
    })
  } catch (error) {
    console.error('Pricing error:', error)
    res.status(500).json({
      ok: false,
      error: 'Failed to get pricing'
    })
  }
})

// Маршрут для получения новостей
app.get('/api/news', (req, res) => {
  try {
    const news = [
      { 
        id: 1, 
        title: 'Новые трассы в секторе А', 
        date: '2023-12-15', 
        content: 'Добавлено 5 новых трасс разной сложности',
        image: '/news1.jpg'
      },
      { 
        id: 2, 
        title: 'Соревнования по скалолазанию', 
        date: '2023-12-20', 
        content: 'Приглашаем всех на соревнования 25 декабря',
        image: '/news2.jpg'
      },
      { 
        id: 3, 
        title: 'Новогодняя акция', 
        date: '2024-01-01', 
        content: 'Скидка 20% на все абонементы до конца января',
        image: '/news3.jpg'
      }
    ]
    
    res.json({
      ok: true,
      news
    })
  } catch (error) {
    console.error('News error:', error)
    res.status(500).json({
      ok: false,
      error: 'Failed to get news'
    })
  }
})

// Маршрут для получения контактов
app.get('/api/contacts', (req, res) => {
  try {
    const contacts = {
      address: 'ул. Скалолазная, д. 123, Москва, 123456',
      phone: '+7 (495) 123-45-67',
      email: 'info@climbing-gym.ru',
      social: {
        instagram: '@climbing_gym',
        telegram: '@climbing_gym',
        vk: 'vk.com/climbing_gym'
      },
      workingHours: {
        weekdays: '09:00 - 22:00',
        weekends: '10:00 - 20:00'
      }
    }
    
    res.json({
      ok: true,
      contacts
    })
  } catch (error) {
    console.error('Contacts error:', error)
    res.status(500).json({
      ok: false,
      error: 'Failed to get contacts'
    })
  }
})

// Маршрут для загрузки фото сектора и распознавания зацепок
app.post('/api/upload-sector', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        ok: false,
        error: 'No image file provided'
      })
    }
    
    const imagePath = req.file.path
    const sectorId = req.body.sectorId
    
    // Распознаем зацепки с помощью Computer Vision
    const detectedHolds = await detectHolds(imagePath)
    
    // Группируем зацепки по цветам
    const holdsByColor = {}
    detectedHolds.forEach(hold => {
      if (!holdsByColor[hold.color]) {
        holdsByColor[hold.color] = []
      }
      holdsByColor[hold.color].push({
        x: hold.x,
        y: hold.y,
        confidence: hold.confidence
      })
    })
    
    res.json({
      ok: true,
      message: 'Image processed successfully',
      data: {
        sectorId: sectorId,
        imageUrl: `/uploads/${req.file.filename}`,
        detectedHolds: holdsByColor,
        totalHolds: detectedHolds.length
      }
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({
      ok: false,
      error: 'Failed to process image'
    })
  }
})

// Маршрут для создания трассы из распознанных зацепок
app.post('/api/create-route', (req, res) => {
  try {
    const { sectorId, category, setter, color, holds } = req.body
    
    if (!sectorId || !category || !setter || !color || !holds || !Array.isArray(holds)) {
      return res.status(400).json({
        ok: false,
        error: 'Missing required fields'
      })
    }
    
    // Здесь должна быть логика сохранения трассы в базу данных
    const newRoute = {
      id: Date.now(), // Временный ID
      sectorId: parseInt(sectorId),
      category,
      setter,
      color,
      holds: holds.map(hold => ({
        x: parseInt(hold.x),
        y: parseInt(hold.y)
      })),
      createdAt: new Date().toISOString()
    }
    
    console.log('New route created:', newRoute)
    
    res.json({
      ok: true,
      message: 'Route created successfully',
      route: newRoute
    })
  } catch (error) {
    console.error('Create route error:', error)
    res.status(500).json({
      ok: false,
      error: 'Failed to create route'
    })
  }
})

// Маршрут для получения достижений пользователя
app.get('/api/achievements/:userId', (req, res) => {
  try {
    const { userId } = req.params
    
    // Здесь должна быть логика получения достижений пользователя из базы данных
    const achievements = [
      { id: 1, title: 'Первый шаг', description: 'Пройдена первая трасса', completed: true, points: 10 },
      { id: 2, title: 'Сложный маршрут', description: 'Пройдена трасса 6а', completed: true, points: 50 },
      { id: 3, title: 'Мастер лазания', description: 'Пройдена трасса 7а', completed: false, points: 100 },
      { id: 4, title: 'Эксперт', description: 'Пройдена трасса 8а', completed: false, points: 200 }
    ]
    
    const totalPoints = achievements
      .filter(a => a.completed)
      .reduce((sum, a) => sum + a.points, 0)
    
    res.json({
      ok: true,
      achievements,
      totalPoints
    })
  } catch (error) {
    console.error('Achievements error:', error)
    res.status(500).json({
      ok: false,
      error: 'Failed to get achievements'
    })
  }
})

// Базовый маршрут
app.get('/', (req, res) => {
  res.json({
    message: 'Climbing Gym Telegram Mini App API',
    version: '1.0.0',
    status: 'running'
  })
})

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    ok: false,
    error: 'Something went wrong!'
  })
})

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
})
