// Примеры данных для тестирования приложения

export const sampleRoutes = [
  {
    id: 1,
    name: 'Трасса "Старт"',
    difficulty: '5а',
    sector: 'Основной зал',
    description: 'Идеальная трасса для начинающих',
    image: '/routes/route1.jpg',
    holds: ['зеленые', 'синие'],
    height: '4м',
    angle: 'вертикальная'
  },
  {
    id: 2,
    name: 'Трасса "Вызов"',
    difficulty: '6а',
    sector: 'Основной зал',
    description: 'Средний уровень сложности',
    image: '/routes/route2.jpg',
    holds: ['красные', 'желтые'],
    height: '5м',
    angle: 'нависание 10°'
  },
  {
    id: 3,
    name: 'Трасса "Мастер"',
    difficulty: '7а',
    sector: 'Сектор А',
    description: 'Для опытных скалолазов',
    image: '/routes/route3.jpg',
    holds: ['черные', 'белые'],
    height: '6м',
    angle: 'нависание 20°'
  },
  {
    id: 4,
    name: 'Трасса "Эксперт"',
    difficulty: '8а',
    sector: 'Сектор Б',
    description: 'Максимальная сложность',
    image: '/routes/route4.jpg',
    holds: ['микс'],
    height: '7м',
    angle: 'нависание 30°'
  }
]

export const sampleSchedule = [
  { 
    time: '09:00-10:00', 
    activity: 'Детская группа (5-8 лет)', 
    type: 'group',
    instructor: 'Анна Петрова',
    maxParticipants: 8,
    currentParticipants: 5
  },
  { 
    time: '10:00-11:00', 
    activity: 'Детская группа (9-12 лет)', 
    type: 'group',
    instructor: 'Михаил Иванов',
    maxParticipants: 10,
    currentParticipants: 7
  },
  { 
    time: '11:00-12:00', 
    activity: 'Йога для скалолазов', 
    type: 'yoga',
    instructor: 'Елена Сидорова',
    maxParticipants: 15,
    currentParticipants: 12
  },
  { 
    time: '14:00-15:00', 
    activity: 'Взрослая группа (начинающие)', 
    type: 'group',
    instructor: 'Алексей Козлов',
    maxParticipants: 12,
    currentParticipants: 9
  },
  { 
    time: '15:00-16:00', 
    activity: 'Взрослая группа (продвинутые)', 
    type: 'group',
    instructor: 'Дмитрий Соколов',
    maxParticipants: 10,
    currentParticipants: 8
  },
  { 
    time: '18:00-19:00', 
    activity: 'Мастер-класс по технике', 
    type: 'masterclass',
    instructor: 'Ольга Морозова',
    maxParticipants: 20,
    currentParticipants: 15
  },
  { 
    time: '19:00-20:00', 
    activity: 'Свободное лазание', 
    type: 'free',
    instructor: null,
    maxParticipants: 50,
    currentParticipants: 25
  }
]

export const samplePricing = [
  { 
    id: 1, 
    name: 'Разовое посещение', 
    price: 800, 
    originalPrice: null,
    description: 'Одно посещение в любое время',
    duration: '1 день',
    features: ['Доступ ко всем трассам', 'Снаряжение включено', 'Инструктаж']
  },
  { 
    id: 2, 
    name: 'Абонемент на месяц', 
    price: 4000, 
    originalPrice: null,
    description: 'Безлимитные посещения',
    duration: '30 дней',
    features: ['Неограниченные посещения', 'Скидка 10% на снаряжение', 'Приоритетная запись']
  },
  { 
    id: 3, 
    name: 'Абонемент на 3 месяца', 
    price: 10000, 
    originalPrice: 12000,
    description: 'Скидка 17%',
    duration: '90 дней',
    features: ['Неограниченные посещения', 'Скидка 15% на снаряжение', 'Бесплатные мастер-классы']
  },
  { 
    id: 4, 
    name: 'Семейный абонемент', 
    price: 6000, 
    originalPrice: null,
    description: 'Для 2 взрослых + дети до 16 лет',
    duration: '30 дней',
    features: ['2 взрослых + дети', 'Скидка на детские группы', 'Семейные мероприятия']
  }
]

export const sampleNews = [
  { 
    id: 1, 
    title: 'Новые трассы в секторе А', 
    date: '2023-12-15', 
    content: 'Добавлено 5 новых трасс разной сложности. Открыт набор в детские группы!',
    image: '/news/news1.jpg',
    category: 'Новости',
    isImportant: true
  },
  { 
    id: 2, 
    title: 'Соревнования по скалолазанию', 
    date: '2023-12-20', 
    content: 'Приглашаем всех на соревнования 25 декабря. Призы для победителей!',
    image: '/news/news2.jpg',
    category: 'События',
    isImportant: true
  },
  { 
    id: 3, 
    title: 'Новогодняя акция', 
    date: '2024-01-01', 
    content: 'Скидка 20% на все абонементы до конца января. Не упустите возможность!',
    image: '/news/news3.jpg',
    category: 'Акции',
    isImportant: false
  },
  { 
    id: 4, 
    title: 'Мастер-класс по технике безопасности', 
    date: '2024-01-10', 
    content: 'Бесплатный мастер-класс для всех желающих. Регистрация обязательна.',
    image: '/news/news4.jpg',
    category: 'Обучение',
    isImportant: false
  }
]

export const sampleContacts = {
  address: {
    street: 'ул. Скалолазная, д. 123',
    city: 'Москва',
    postalCode: '123456',
    coordinates: {
      lat: 55.7558,
      lng: 37.6176
    }
  },
  phone: '+7 (495) 123-45-67',
  email: 'info@climbing-gym.ru',
  website: 'https://climbing-gym.ru',
  social: {
    instagram: '@climbing_gym',
    telegram: '@climbing_gym',
    vk: 'vk.com/climbing_gym',
    youtube: 'youtube.com/climbing_gym'
  },
  workingHours: {
    weekdays: '09:00 - 22:00',
    weekends: '10:00 - 20:00',
    holidays: '10:00 - 18:00'
  },
  facilities: [
    'Парковка',
    'Раздевалки',
    'Душ',
    'Кафе',
    'Магазин снаряжения',
    'Wi-Fi'
  ]
}

export const sampleAchievements = [
  { 
    id: 1, 
    title: 'Первый шаг', 
    description: 'Пройдена первая трасса', 
    completed: true, 
    points: 10,
    icon: '🏃',
    category: 'Начало'
  },
  { 
    id: 2, 
    title: 'Сложный маршрут', 
    description: 'Пройдена трасса 6а', 
    completed: true, 
    points: 50,
    icon: '🧗',
    category: 'Техника'
  },
  { 
    id: 3, 
    title: 'Мастер лазания', 
    description: 'Пройдена трасса 7а', 
    completed: false, 
    points: 100,
    icon: '🏆',
    category: 'Мастерство'
  },
  { 
    id: 4, 
    title: 'Эксперт', 
    description: 'Пройдена трасса 8а', 
    completed: false, 
    points: 200,
    icon: '👑',
    category: 'Эксперт'
  },
  { 
    id: 5, 
    title: 'Регулярный посетитель', 
    description: 'Посещение 10 раз подряд', 
    completed: true, 
    points: 30,
    icon: '📅',
    category: 'Постоянство'
  },
  { 
    id: 6, 
    title: 'Социальный скалолаз', 
    description: 'Привел друга', 
    completed: false, 
    points: 25,
    icon: '👥',
    category: 'Социальное'
  }
]

