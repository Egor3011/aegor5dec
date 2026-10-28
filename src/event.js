export const organizer = {
  telegramHandle: '@zavoz_contenta',
  telegramUrl: 'https://t.me/zavoz_contenta'
}

// Все даты — по Москве. Год и программа подтверждены организатором.
export const event = {
  title: 'Егору Аксёнову — 18!',
  year: 2026,
  start: '2026-12-05T18:00:00+03:00',
  end: '2026-12-06T11:00:00+03:00',
  location: 'Брянск, с. Толмачево, СДТ Союз, 195',
  description: [
    '5–6 декабря — день рождения Егора Аксёнова.',
    '18:00–22:00 — концерт UGLYSTEPHAN, клуб Deus.',
    '22:00–23:30 — добираемся до дома; трансфер — минивэн Hyundai Staria.',
    '22:30–11:00 (6 декабря) — тусовка на доме: баня, кальян, алкоголь.',
    'Адрес дома: Брянск, с. Толмачево, СДТ Союз, 195.',
    'Для москвичей: 06:35 встреча на вокзале; 06:50–11:02 поезд Москва → Брянск;',
    '11:30–17:30 обед и знакомство с Брянском.',
    '6 декабря: 12:00 завтрак; 13:23–17:31 поезд Брянск → Москва.',
    'Время поездов — из приглашения. Проверьте актуальное расписание перед покупкой.',
    'Начало тусовки и трансфер частично пересекаются — время сбора уточняется.',
    `Контакт Егора в Telegram: ${organizer.telegramHandle} — ${organizer.telegramUrl}`
  ].join('\n')
}

export const trainLinks = {
  outbound: 'https://ticket.rzd.ru/searchresults/v/1/5a323c29340c7441a0a556bb/5a13bbe4340c745ca1e83994/2026-12-05?aim=social-media&trainNumber=737%D0%90&adult=1',
  inbound: 'https://ticket.rzd.ru/searchresults/v/1/5a13bbe4340c745ca1e83994/5a323c29340c7441a0a556bb/2026-12-06?aim=social-media&trainNumber=740%D0%90&adult=1'
  
}

export const saturday = [
  { time: '06:35', title: 'Встречаемся на вокзале', detail: 'Для тех, кто едет из Москвы. Начинаем этот уикенд вместе.', tag: 'МОСКВИЧАМ', icon: 'train' },
  { time: '06:50 — 11:02', title: 'Москва → Брянск', detail: 'Четыре часа в дороге. Компания уже собрана — осталось взять билет.', link: trainLinks.outbound, linkText: 'Билеты на 5 декабря', icon: 'train' },
  { time: '11:30 — 17:30', title: 'Знакомимся с Брянском', detail: 'Обед, прогулка, подготовка дома и время настроиться на вечер.', icon: 'sun' },
  { time: '18:00 — 22:00', title: 'UGLYSTEPHAN', detail: 'Концерт в клубе Deus. Будет громко.', tag: 'ГЛАВНЫЙ РАЗОГРЕВ', icon: 'music', featured: true },
  { time: '22:00 — 23:30', title: 'Из клуба — на дом', detail: 'Едем на минивэне Hyundai Staria. Точное место сбора сообщим перед поездкой.', icon: 'van' },
  { time: '22:30 — 11:00', title: 'Тусовка на доме', detail: 'До утра 6 декабря. Баня, кальян, алкоголь, музыка, фотографии, авктивности и куча крутых моментов.', tag: 'ДО УТРА', icon: 'house', featured: true }
]

export const sunday = [
  { time: '12:00', title: 'Завтрак без спешки', detail: 'Собираемся за столом и пытаемся вспомить, как это было.', icon: 'sun' },
  { time: '13:23 — 17:31', title: 'Брянск → Москва', detail: 'Возвращаемся домой. Этот уикенд останется с нами.', link: trainLinks.inbound, linkText: 'Билеты на 6 декабря', icon: 'train' }
]
