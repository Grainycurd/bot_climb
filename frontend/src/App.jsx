import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, User, Calendar, Mountain, Clock, CreditCard, Trophy, Newspaper, MapPin, Star, ChevronLeft, ChevronRight } from 'lucide-react'

// Telegram WebApp API
const tg = window.Telegram?.WebApp

// Компонент хидера с логотипом
function AppHeader({ user, onBack }) {
  return (
    <motion.div
      className="app-header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="header-content">
        <div className="logo-section">
          <div className="logo">
            <img src="/logo.png" alt="Скалодром" className="logo-icon" />
            <div className="logo-text">
              <span className="logo-title">Скалодром</span>
              <span className="logo-subtitle">  Limestone</span>
            </div>
          </div>
        </div>

        {user && (
          <motion.div
            className="user-greeting"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <div className="greeting-text">
              <span className="greeting-hello">Привет,</span>
              <span className="greeting-name">{user.first_name || 'Скалолаз'}!</span>
            </div>
            <div className="greeting-subtitle">Добро пожаловать в наш скалодром</div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

// Компонент главного экрана
function HomeScreen() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (tg) {
      tg.ready()
      tg.expand()

      // Получаем данные пользователя из Telegram
      const userData = tg.initDataUnsafe?.user
      if (userData) {
        setUser(userData)
        // Отправляем данные на бэкенд для авторизации
        authenticateUser(userData)
      } else {
        setLoading(false)
      }
    }
  }, [])

  const authenticateUser = async (userData) => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          initData: tg.initData,
          user: userData
        })
      })

      const result = await response.json()
      if (result.ok) {
        setUser(result.user)
      }
    } catch (error) {
      console.error('Auth error:', error)
    } finally {
      setLoading(false)
    }
  }

  const menuItems = [
    { id: 'booking', icon: Calendar, text: 'Записаться на тренировку', path: '/booking' },
    { id: 'routes', icon: Mountain, text: 'Посмотреть трассы', path: '/routes' },
    { id: 'schedule', icon: Clock, text: 'Расписание', path: '/schedule' },
    { id: 'pricing', icon: CreditCard, text: 'Абонементы и цены', path: '/pricing' },
    { id: 'achievements', icon: Trophy, text: 'Мои достижения', path: '/achievements' },
    { id: 'news', icon: Newspaper, text: 'Новости и события', path: '/news' },
    { id: 'contacts', icon: MapPin, text: 'Контакты и адрес', path: '/contacts' }
  ]

  if (loading) {
    return (
      <div className="screen">
        <div className="container">
          <div className="loading">Загрузка...</div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <AppHeader user={user} />
      <div className="container">

        <motion.div
          className="menu-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          {menuItems.map((item, index) => (
            <motion.div
              key={item.id}
              className="menu-item"
              onClick={() => navigate(item.path)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <item.icon className="menu-icon" />
              <span className="menu-text">{item.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}

// Компонент экрана записи на тренировку
function BookingScreen() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    type: 'group'
  })
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Здесь будет отправка данных на бэкенд
      await new Promise(resolve => setTimeout(resolve, 1000)) // Имитация запроса
      setMessage('Успешно записались на тренировку!')
      setTimeout(() => {
        navigate('/')
      }, 2000)
    } catch (error) {
      setMessage('Ошибка при записи. Попробуйте еще раз.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.div
      className="screen"
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -300 }}
      transition={{ duration: 0.3 }}
    >
      <div className="screen-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft />
        </button>
        <h1 className="screen-title">Записаться на тренировку</h1>
        <div></div>
      </div>
      <div className="container">

        {message && (
          <div className={message.includes('Ошибка') ? 'error' : 'success'}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Ваше имя</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Телефон</label>
            <input
              type="tel"
              className="form-input"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className="btn"
            disabled={submitting}
          >
            {submitting ? 'Записываем...' : 'Записаться'}
          </button>
        </form>
      </div>
    </motion.div>
  )
}

// Компонент экрана выбора секторов
function RoutesScreen() {
  const navigate = useNavigate()
  const [sectors, setSectors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Имитация загрузки секторов
    setTimeout(() => {
      setSectors([
        { id: 1, name: 'Сектор 1', photoUrl: '/sector/1.jpg', routeCount: 8 },
        { id: 2, name: 'Сектор 2', photoUrl: '/sector/2.jpg', routeCount: 12 },
        { id: 3, name: 'Сектор 3', photoUrl: '/sector/3.jpg', routeCount: 6 },
        { id: 4, name: 'Сектор 4', photoUrl: '/sector/4.jpg', routeCount: 10 },
        { id: 5, name: 'Сектор 5', photoUrl: '/sector/5.jpg', routeCount: 7 },
        { id: 6, name: 'Сектор 6', photoUrl: '/sector/6.jpg', routeCount: 9 }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  return (
    <motion.div
      className="screen"
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -300 }}
      transition={{ duration: 0.3 }}
    >
      <div className="screen-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft />
        </button>
        <h1 className="screen-title">Секторы скалодрома</h1>
        <div></div>
      </div>
      <div className="container">

        {loading ? (
          <div className="loading">Загружаем секторы...</div>
        ) : (
          <div className="sectors-grid">
            {sectors.map((sector, index) => (
              <motion.div
                key={sector.id}
                className="sector-card"
                onClick={() => navigate(`/sector/${sector.id}`)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="sector-image">
                  <img src={sector.photoUrl} alt={sector.name} />
                  <div className="sector-overlay">
                    <div className="sector-info">
                      <h3>{sector.name}</h3>
                      <p>{sector.routeCount} трасс</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Компонент просмотра сектора с интерактивным фото
function SectorViewScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const sectorId = location.pathname.split('/')[2]

  const [sector, setSector] = useState(null)
  const [routes, setRoutes] = useState([])
  const [currentRouteIndex, setCurrentRouteIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [canvasRef, setCanvasRef] = useState(null)

  useEffect(() => {
    // Имитация загрузки данных сектора
    setTimeout(() => {
      setSector({
        id: sectorId,
        name: `Сектор ${sectorId}`,
        photoUrl: `/sector/${sectorId}.jpg`
      })

      // Имитация трасс с координатами зацепок
      setRoutes([
        {
          id: 1,
          category: '6а',
          setter: 'Свиридов',
          color: 'yellow',
          holds: [

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
      ])
      setLoading(false)
    }, 1000)
  }, [sectorId])

  useEffect(() => {
    if (canvasRef && routes.length > 0) {
      drawRouteHolds()
    }
  }, [currentRouteIndex, routes, canvasRef])

  const drawRouteHolds = () => {
    if (!canvasRef || !routes[currentRouteIndex]) return

    const canvas = canvasRef
    const ctx = canvas.getContext('2d')
    const img = canvas.parentElement.querySelector('img')

    if (!img) return

    // Очищаем canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const currentRoute = routes[currentRouteIndex]
    if (!currentRoute) return

    // Рисуем зацепки
    currentRoute.holds.forEach((hold, index) => {
      ctx.beginPath()
      ctx.arc(hold.x, hold.y, 12, 0, 2 * Math.PI)
      ctx.fillStyle = currentRoute.color
      ctx.fill()
      ctx.strokeStyle = 'white'
      ctx.lineWidth = 3
      ctx.stroke()

      // Номер зацепки
      ctx.fillStyle = 'white'
      ctx.font = 'bold 12px Arial'
      ctx.textAlign = 'center'
      ctx.fillText((index + 1).toString(), hold.x, hold.y + 4)
    })
  }

  const nextRoute = () => {
    setCurrentRouteIndex((prev) => (prev + 1) % routes.length)
  }

  const prevRoute = () => {
    setCurrentRouteIndex((prev) => (prev - 1 + routes.length) % routes.length)
  }

  if (loading) {
    return (
      <motion.div
        className="screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container">
          <div className="loading">Загружаем сектор...</div>
        </div>
      </motion.div>
    )
  }

  const currentRoute = routes[currentRouteIndex]

  return (
    <motion.div
      className="screen"
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -300 }}
      transition={{ duration: 0.3 }}
    >
      <div className="screen-header">
        <button className="back-btn" onClick={() => navigate('/routes')}>
          <ArrowLeft />
        </button>
        <h1 className="screen-title">{sector?.name}</h1>
        <div></div>
      </div>

      <div className="container">
        <div className="sector-photo-container">
          <div className="sector-photo-wrapper">
            <img
              src={sector?.photoUrl}
              alt={sector?.name}
              className="sector-photo"
            />
            <canvas
              ref={setCanvasRef}
              className="route-overlay"
              width={480}
              height={640}
            />
          </div>
        </div>

        <div className="route-navigation">
          <button className="nav-btn" onClick={prevRoute}>
            <ChevronLeft size={24} />
          </button>

          <div className="route-info">
            <div className="route-category">{currentRoute?.category}</div>
            <div className="route-setter">Накрутчик: {currentRoute?.setter}</div>
            <div className="route-color">Цвет: {currentRoute?.color}</div>
          </div>

          <button className="nav-btn" onClick={nextRoute}>
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="route-counter">
          Трасса {currentRouteIndex + 1} из {routes.length}
        </div>
      </div>
    </motion.div>
  )
}

// Компонент экрана расписания
function ScheduleScreen() {
  const navigate = useNavigate()

  const schedule = [
    { time: '09:00-10:00', activity: 'Детская группа (5-8 лет)', type: 'group' },
    { time: '10:00-11:00', activity: 'Детская группа (9-12 лет)', type: 'group' },
    { time: '11:00-12:00', activity: 'Йога для скалолазов', type: 'yoga' },
    { time: '14:00-15:00', activity: 'Взрослая группа (начинающие)', type: 'group' },
    { time: '15:00-16:00', activity: 'Взрослая группа (продвинутые)', type: 'group' },
    { time: '18:00-19:00', activity: 'Мастер-класс по технике', type: 'masterclass' },
    { time: '19:00-20:00', activity: 'Свободное лазание', type: 'free' }
  ]

  return (
    <motion.div
      className="screen"
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -300 }}
      transition={{ duration: 0.3 }}
    >
      <div className="screen-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft />
        </button>
        <h1 className="screen-title">Расписание</h1>
        <div></div>
      </div>
      <div className="container">

        <div className="card">
          <div className="card-title">Время работы</div>
          <div className="card-text">Пн-Пт: 09:00 - 22:00</div>
          <div className="card-text">Сб-Вс: 10:00 - 20:00</div>
        </div>

        <h2 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
          Расписание занятий
        </h2>

        {schedule.map((item, index) => (
          <motion.div
            key={index}
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <div className="card-title">{item.time}</div>
            <div className="card-text">{item.activity}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// Компонент экрана цен
function PricingScreen() {
  const navigate = useNavigate()

  const pricing = [
    { name: 'Разовое посещение', price: '800 ₽', description: 'Одно посещение в любое время' },
    { name: 'Абонемент на месяц', price: '4000 ₽', description: 'Безлимитные посещения' },
    { name: 'Абонемент на 3 месяца', price: '10000 ₽', description: 'Скидка 17%' },
    { name: 'Семейный абонемент', price: '6000 ₽', description: 'Для 2 взрослых + дети' }
  ]

  return (
    <motion.div
      className="screen"
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -300 }}
      transition={{ duration: 0.3 }}
    >
      <div className="screen-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft />
        </button>
        <h1 className="screen-title">Абонементы и цены</h1>
        <div></div>
      </div>
      <div className="container">

        {pricing.map((item, index) => (
          <motion.div
            key={index}
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <div className="card-title">{item.name}</div>
            <div style={{ fontSize: '20px', fontWeight: '600', color: 'var(--tg-theme-button-color)', marginBottom: '8px' }}>
              {item.price}
            </div>
            <div className="card-text">{item.description}</div>
            <button className="btn btn-pricing" style={{ marginTop: '12px' }}>
              Купить онлайн
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// Компонент экрана достижений
function AchievementsScreen() {
  const navigate = useNavigate()

  const achievements = [
    { title: 'Первый шаг', description: 'Пройдена первая трасса', completed: true, points: 10 },
    { title: 'Сложный маршрут', description: 'Пройдена трасса 6а', completed: true, points: 50 },
    { title: 'Мастер лазания', description: 'Пройдена трасса 7а', completed: false, points: 100 },
    { title: 'Эксперт', description: 'Пройдена трасса 8а', completed: false, points: 200 }
  ]

  return (
    <motion.div
      className="screen"
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -300 }}
      transition={{ duration: 0.3 }}
    >
      <div className="screen-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft />
        </button>
        <h1 className="screen-title">Мои достижения</h1>
        <div></div>
      </div>
      <div className="container">

        <div className="card">
          <div className="card-title">Общие очки</div>
          <div style={{ fontSize: '24px', fontWeight: '600', color: 'var(--tg-theme-button-color)' }}>
            60 очков
          </div>
        </div>

        {achievements.map((achievement, index) => (
          <motion.div
            key={index}
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            style={{
              opacity: achievement.completed ? 1 : 0.6,
              border: achievement.completed ? '2px solid var(--tg-theme-button-color)' : 'none'
            }}
          >
            <div className="card-title">
              {achievement.completed && '🏆 '}{achievement.title}
            </div>
            <div className="card-text">{achievement.description}</div>
            <div className="card-text">Очки: {achievement.points}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// Компонент экрана новостей
function NewsScreen() {
  const navigate = useNavigate()

  const news = [
    { title: 'Новые трассы в секторе А', date: '15.12.2023', photoUrl: '/news/limecombat.jpg' },
    { title: 'Соревнования по скалолазанию', date: '20.12.2023', content: 'Приглашаем всех на соревнования 25 декабря' },
    { title: 'Новогодняя акция', date: '01.01.2024', content: 'Скидка 20% на все абонементы до конца января' }
  ]

  return (
    <motion.div
      className="screen"
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -300 }}
      transition={{ duration: 0.3 }}
    >
      <div className="screen-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft />
        </button>
        <h1 className="screen-title">Новости и события</h1>
        <div></div>
      </div>
      <div className="container">

        {news.map((item, index) => (
          <motion.div
            key={index}
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <div className="card-title">{item.title}</div>
            <div className="card-text" style={{ marginBottom: '8px' }}>{item.date}</div>
            <div className="card-text">{item.content}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// Компонент экрана контактов
function ContactsScreen() {
  const navigate = useNavigate()

  const openMap = () => {
    if (tg) {
      tg.openLink('https://yandex.ru/maps/?text=скалодром')
    }
  }

  return (
    <motion.div
      className="screen"
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -300 }}
      transition={{ duration: 0.3 }}
    >
      <div className="screen-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft />
        </button>
        <h1 className="screen-title">Контакты и адрес</h1>
        <div></div>
      </div>
      <div className="container">

        <div className="card">
          <div className="card-title">Адрес</div>
          <div className="card-text">Доброслободская ул., 21, Москва</div>
          <div className="card-text">Москва, 105066</div>
          <div className="map">
            <iframe src="https://yandex.ru/map-widget/v1/?um=constructor%3Aaa356bf359c23f809fc62dfffb0a171295f9f2ac9d5af9bda640394330b6329d&amp;source=constructor" width="500" height="400" frameborder="0"></iframe>
          </div>
          <button className="btn btn-contact" onClick={openMap} style={{ marginTop: '12px' }}>
            Проложить маршрут
          </button>
        </div>

        <div className="card">
          <div className="card-title">Телефон</div>
          <div className="card-text">+7 (495) 308-39-93</div>
          <a className='btn-call' href="tel:+7(495)308-39-93">
            <button className="btn btn-contact" style={{ marginTop: '12px' }}>
              Позвонить
            </button>
          </a>
        </div>

        <div className="card">
          <div className="card-title">Социальные сети</div>
          <div className="card-text">Instagram: @climbing_gym</div>
          <div className="card-text">Telegram: @climbing_gym</div>
          <button className="btn btn-contact" style={{ marginTop: '12px' }}>
            Перейти в Telegram
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// Основной компонент приложения
function App() {
  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/booking" element={<BookingScreen />} />
          <Route path="/routes" element={<RoutesScreen />} />
          <Route path="/sector/:id" element={<SectorViewScreen />} />
          <Route path="/schedule" element={<ScheduleScreen />} />
          <Route path="/pricing" element={<PricingScreen />} />
          <Route path="/achievements" element={<AchievementsScreen />} />
          <Route path="/news" element={<NewsScreen />} />
          <Route path="/contacts" element={<ContactsScreen />} />
        </Routes>
      </AnimatePresence>
    </Router>
  )
}

export default App
