<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import Icon from './components/Icon.vue'
import { event, organizer, saturday, sunday, trainLinks } from './event.js'
import { googleCalendarUrl } from './calendar.js'

const activeDay = ref('saturday')
const now = ref(Date.now())
const reducedMotion = ref(false)
const motionPaused = ref(false)
const toast = ref('')
const calendarDialog = ref(null)
const ticket = ref(null)
const confetti = ref([])
const year = event.year
const calendarUrl = googleCalendarUrl()
const appleCalendarUrl = `webcal://${window.location.host}/egor-18.ics`
const mapUrl = `https://yandex.ru/maps/?text=${encodeURIComponent(event.location)}`
const schedule = computed(() => activeDay.value === 'saturday' ? saturday : sunday)
const secondsLeft = computed(() => Math.max(0, Math.floor((new Date(event.start).getTime() - now.value) / 1000)))
const eventFinished = computed(() => now.value >= new Date(event.end).getTime())
const countdown = computed(() => [
  { value: Math.floor(secondsLeft.value / 86400), label: 'дней' },
  { value: Math.floor(secondsLeft.value / 3600) % 24, label: 'часов' },
  { value: Math.floor(secondsLeft.value / 60) % 60, label: 'минут' },
  { value: secondsLeft.value % 60, label: 'секунд' }
])
let clockInterval, revealObserver, toastTimeout, confettiTimeout, motionQuery

function notify(message) {
  toast.value = message
  clearTimeout(toastTimeout)
  toastTimeout = setTimeout(() => toast.value = '', 4500)
}

async function copyAddress() {
  try {
    await navigator.clipboard.writeText(event.location)
    notify('Адрес скопирован. Увидимся там!')
  } catch {
    notify('Не удалось скопировать. Адрес можно выделить ниже или открыть на карте.')
  }
}

function openCalendar() {
  calendarDialog.value.showModal()
}

function celebrate() {
  if (reducedMotion.value || motionPaused.value) {
    notify('18 — только начало. Увидимся на празднике!')
    return
  }
  confetti.value = Array.from({ length: 65 }, (_, index) => ({
    id: index, left: `${Math.random() * 100}%`, delay: `${Math.random() * .4}s`,
    duration: `${1.6 + Math.random() * 1.2}s`, rotate: `${Math.random() * 720}deg`,
    drift: `${Math.random() * 240 - 120}px`
  }))
  clearTimeout(confettiTimeout)
  confettiTimeout = setTimeout(() => confetti.value = [], 3500)
}

function tiltTicket(e) {
  if (e.pointerType !== 'mouse' || reducedMotion.value || motionPaused.value) return
  const bounds = ticket.value.getBoundingClientRect()
  const x = (e.clientX - bounds.left) / bounds.width - .5
  const y = (e.clientY - bounds.top) / bounds.height - .5
  ticket.value.style.setProperty('--rotate-x', `${-y * 3}deg`)
  ticket.value.style.setProperty('--rotate-y', `${x * 3}deg`)
}

function resetTilt() {
  ticket.value?.style.setProperty('--rotate-x', '0deg')
  ticket.value?.style.setProperty('--rotate-y', '0deg')
}

function syncMotion() {
  reducedMotion.value = motionQuery.matches
  if (reducedMotion.value) resetTilt()
}

onMounted(() => {
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  syncMotion()
  motionQuery.addEventListener('change', syncMotion)
  clockInterval = setInterval(() => now.value = Date.now(), 1000)
  revealObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
        revealObserver.unobserve(entry.target)
      }
    }
  }, { threshold: .12 })
  document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el))
})

onUnmounted(() => {
  clearInterval(clockInterval)
  clearTimeout(toastTimeout)
  clearTimeout(confettiTimeout)
  revealObserver?.disconnect()
  motionQuery?.removeEventListener('change', syncMotion)
})
</script>

<template>
  <div class="site" :class="{ 'motion-paused': motionPaused, 'reduce-motion': reducedMotion }">
    <a class="skip-link" href="#main">К приглашению</a>
    <header class="site-header wrap">
      <a class="wordmark" href="#main" aria-label="Егор, 18 — к началу">ЕА<span> / 18</span><i class="wordmark-dot"></i></a>
      <nav aria-label="Навигация">
        <a href="#program">Программа</a>
        <a href="#route" class="nav-route">Как добраться</a>
        <button class="nav-calendar" @click="openCalendar"><Icon name="calendar" /> <span>В календарь</span></button>
      </nav>
    </header>

    <main id="main">
      <section class="hero wrap" aria-labelledby="hero-title">
        <div class="hero-eyebrow intro-item"><span><i class="live-dot"></i> ЛИЧНОЕ ПРИГЛАШЕНИЕ</span><span>05—06 / 12 / {{ year }}</span></div>
        <div ref="ticket" class="invitation-ticket intro-item" @pointermove="tiltTicket" @pointerleave="resetTilt">
          <div class="ticket-main">
            <div class="portrait-column">
              <div class="portrait-frame">
                <img src="/images/poster.png" alt="Егор Аксёнов улыбается" width="3434" height="1600" fetchpriority="high" />
              </div>
              <span class="portrait-caption">ИМЕНИННИК / ЛИЧНО ЗНАКОМЫ</span>
              <div class="portrait-stamp" aria-hidden="true"><span>ЭТО БУДЕТ</span><Icon name="sparkle" /><span>ЛЕГЕНДАРНО</span></div>
            </div>
            <div class="ticket-info">
              <p class="ticket-kicker">ПРИГЛАШЕНИЕ НА ДЕНЬ РОЖДЕНИЯ</p>
              <h1 id="hero-title" class="display">ЕГОР<br />АКСЁНОВ</h1>
              <div class="age-line"><button class="age display" @click="celebrate" aria-label="Отпраздновать 18-летие — запустить конфетти">18</button><span class="display age-label">ЛЕТ</span><span class="age-rule"></span><span class="age-note">НОВАЯ ГЛАВА.<br />ТЕ ЖЕ СВОИ.</span></div>
              <div class="ticket-date"><strong class="display">5—6 ДЕКАБРЯ</strong><span>СУББОТА + ВОСКРЕСЕНЬЕ</span></div>
              <div class="ticket-bottom"><span><Icon name="pin" /> БРЯНСК / ТОЛМАЧЕВО</span><span class="ticket-id">№ 000018</span></div>
            </div>
          </div>
          <aside class="ticket-stub" aria-label="Твой билет на праздник">
            <div class="stub-top">ADMIT ONE<span>ТВОЁ МЕСТО — РЯДОМ</span></div>
            <div class="stub-middle"><span>ПРОПУСК В</span><strong class="display">18</strong><span>ЛУЧШИЙ УИКЕНД</span></div>
            <div class="barcode" aria-hidden="true"></div>
            <span class="stub-bottom">05.12.26 / BRYANSK</span>
          </aside>
        </div>
        <div class="hero-actions intro-item">
          <p>Два дня. Один день рождения.<br /><strong>И ты обязательно должен быть рядом.</strong></p>
          <div class="hero-buttons"><button class="button button-dark" @click="openCalendar">Сохранить дату <Icon name="calendar" /></button><a class="button button-outline" href="#program">Что нас ждёт <Icon name="down" /></a></div>
        </div>
        <div class="hero-foot intro-item"><span>ХОРОШИЕ ЛЮДИ. ПЛОХОЙ РЕЖИМ СНА.</span><a href="#weekend">ЛИСТАЙ К ПЛАНАМ <Icon name="down" /></a></div>
      </section>

      <div class="marquee-bar" aria-label="Концерт, баня, кальян, алкоголь, свои люди, до утра">
        <div class="marquee-window"><div class="marquee-track" aria-hidden="true"><span v-for="n in 4" :key="n">КОНЦЕРТ <i>✳</i> БАНЯ <i>✳</i> КАЛЬЯН <i>✳</i> АЛКОГОЛЬ <i>✳</i> СВОИ ЛЮДИ <i>✳</i> ДО УТРА <i>✳</i>&nbsp;</span></div></div>
        <button class="motion-toggle" @click="motionPaused = !motionPaused; resetTilt()" :aria-label="motionPaused ? 'Включить анимации' : 'Приостановить анимации'" :aria-pressed="motionPaused"><Icon :name="motionPaused ? 'play' : 'pause'" /></button>
      </div>

      <section id="weekend" class="weekend-section wrap" aria-labelledby="weekend-title">
        <div class="section-label" data-reveal><span>01 / ПОВОД СОБРАТЬСЯ</span><Icon name="sparkle" /></div>
        <div class="weekend-grid">
          <div data-reveal><h2 id="weekend-title" class="display">ТАКИЕ ДНИ<br />НЕ ПОВТОРЯЮТСЯ.</h2><p class="section-description">Поэтому собираем своих, выключаем будни<br class="desktop-break" /> и делаем этот уикенд особенным.</p><a class="text-link" href="#program">Весь план по минутам <Icon name="arrow" /></a></div>
          <div class="countdown-box" data-reveal><span class="eyebrow">{{ eventFinished ? 'ЭТО БЫЛО ЛЕГЕНДАРНО' : secondsLeft === 0 ? 'ПРАЗДНИК УЖЕ НАЧАЛСЯ' : 'ДО НАШЕЙ ВСТРЕЧИ' }}</span><div class="countdown" role="timer" aria-label="Обратный отсчёт до 5 декабря, 18:00 по Москве"><div v-for="unit in countdown" :key="unit.label" class="countdown-unit"><Transition name="digit" mode="out-in"><strong :key="unit.value">{{ String(unit.value).padStart(2, '0') }}</strong></Transition><span>{{ unit.label }}</span></div></div><div class="countdown-bottom"><i class="live-dot"></i> 5 ДЕКАБРЯ / 18:00 / МСК</div></div>
        </div>
        <div class="weekend-features">
          <div data-reveal><span class="feature-number">/01</span><Icon name="music" /><h3>Громче обычного</h3><p>UGLYSTEPHAN в клубе Deus.<br />Вечер начинается с концерта.</p></div>
          <div data-reveal><span class="feature-number">/02</span><Icon name="house" /><h3>Ближе к своим</h3><p>Дом, баня, кальян и разговоры,<br />которые затянутся до утра.</p></div>
          <div data-reveal><span class="feature-number">/03</span><Icon name="van" /><h3>Вместе по пути</h3><p>Трансфер на Hyundai Staria.<br />Из клуба едем на дом.</p></div>
        </div>
      </section>

      <section id="program" class="program-section" aria-labelledby="program-title">
        <div class="wrap">
          <div class="section-label" data-reveal><span>02 / НИ МИНУТЫ СКУКИ</span><span>ВСЁ ВРЕМЯ — МОСКОВСКОЕ</span></div>
          <div class="program-heading" data-reveal><h2 id="program-title" class="display">ПЛАН НА<br />ЭТОТ УИКЕНД.</h2><div class="day-switch" role="group" aria-label="Выбрать день программы"><button :class="{ active: activeDay === 'saturday' }" :aria-pressed="activeDay === 'saturday'" @click="activeDay = 'saturday'"><strong>05</strong><span>ДЕКАБРЯ / СБ</span></button><button :class="{ active: activeDay === 'sunday' }" :aria-pressed="activeDay === 'sunday'" @click="activeDay = 'sunday'"><strong>06</strong><span>ДЕКАБРЯ / ВС</span></button></div></div>
          <Transition name="schedule" mode="out-in">
            <div :key="activeDay" class="timeline" aria-live="polite">
              <article v-for="(item, index) in schedule" :key="item.title" class="timeline-row" :class="{ featured: item.featured }" :style="{ '--index': index }">
                <div class="timeline-time"><span>{{ item.time }}</span><span class="timeline-day">{{ activeDay === 'saturday' ? '05 ДЕК' : '06 ДЕК' }}</span></div>
                <div class="timeline-marker"><Icon :name="item.icon" /></div>
                <div class="timeline-content"><span v-if="item.tag" class="timeline-tag">{{ item.tag }}</span><h3 :class="{ display: item.featured }">{{ item.title }}</h3><p>{{ item.detail }}</p><a v-if="item.link" class="text-link" :href="item.link" target="_blank" rel="noopener noreferrer">{{ item.linkText }} <Icon name="arrow" /></a></div>
                <div v-if="item.icon === 'music'" class="equalizer" aria-hidden="true"><i v-for="n in 9" :key="n" :style="{ '--bar': n }"></i></div>
                <span v-else class="timeline-index" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
              </article>
            </div>
          </Transition>
          <p class="program-note">Время поездов — по плану приглашения: проверь расписание перед покупкой. Трансфер и начало тусовки частично пересекаются; точное время сбора уточним.</p>
        </div>
      </section>

      <section id="route" class="route-section wrap" aria-labelledby="route-title">
        <div class="section-label" data-reveal><span>03 / ВСЕ ДОРОГИ ВЕДУТ К НАМ</span><Icon name="arrow" /></div>
        <div class="route-heading" data-reveal><h2 id="route-title" class="display">БЛИЖЕ,<br />ЧЕМ КАЖЕТСЯ.</h2><p>Из Москвы — на поезде.<br />Из клуба — вместе на Hyundai Staria.<br /><strong>Финальная точка — наш дом.</strong></p></div>
        <div class="travel-grid">
          <article class="train-card" data-reveal><div class="travel-card-heading"><Icon name="train" /><span>ДЛЯ МОСКВИЧЕЙ</span><span>01</span></div><div class="train-destination"><strong>МОСКВА</strong><div class="dotted-arrow"><span></span><Icon name="arrow" /></div><strong>БРЯНСК</strong></div><div class="train-leg"><div><span>5 ДЕКАБРЯ / ТУДА</span><strong>06:50 <small>→</small> 11:02</strong></div><a :href="trainLinks.outbound" target="_blank" rel="noopener noreferrer" aria-label="Найти билеты Москва — Брянск на Туту"><Icon name="arrow" /></a></div><div class="train-leg"><div><span>6 ДЕКАБРЯ / ОБРАТНО</span><strong>13:23 <small>→</small> 17:31</strong></div><a :href="trainLinks.inbound" target="_blank" rel="noopener noreferrer" aria-label="Найти билеты Брянск — Москва на Туту"><Icon name="arrow" /></a></div><p class="travel-note">Билеты на Туту · выбери нужную дату поездки.<br />Встречаемся на вокзале в 06:35.</p></article>
          <article class="transfer-card" data-reveal><div class="travel-card-heading"><Icon name="van" /><span>ТРАНСФЕР БУДЕТ</span><span>02</span></div><h3 class="display">ВСЕ СВОИ.<br />НА HYUNDAI STARIA.</h3><figure class="transfer-photo"><img src="/images/hyundai-staria.png" alt="Тёмно-синий минивэн Hyundai Staria для нашего трансфера" width="804" height="450" loading="lazy" decoding="async" /></figure><div class="transfer-bottom"><strong>КЛУБ DEUS <span>→</span> ДОМ</strong><p>Минивэн Hyundai Staria заберёт нас после концерта. Место и точное время сбора сообщим перед поездкой.</p></div></article>
        </div>
        <article class="location-card" data-reveal><div class="location-copy"><span class="eyebrow"><Icon name="pin" /> ФИНАЛЬНАЯ ТОЧКА</span><h3>Брянск, с. Толмачево</h3><p>СДТ Союз, 195</p></div><div class="location-actions"><button class="button button-outline" @click="copyAddress">Скопировать адрес <Icon name="copy" /></button><a class="button button-dark" :href="mapUrl" target="_blank" rel="noopener noreferrer">Открыть карту <Icon name="arrow" /></a></div></article>
      </section>

      <section class="details-section wrap" aria-labelledby="details-title">
        <div data-reveal><span class="eyebrow">04 / ПАРА ДЕТАЛЕЙ</span><h2 id="details-title" class="display">ПЕРЕД ТЕМ,<br />КАК ВЫЕХАТЬ.</h2></div>
        <div class="faq-list" data-reveal>
          <details><summary>Что взять с собой?<span class="faq-plus"></span></summary><p>Удобную одежду для дома, вещи для бани и всё, что нужно тебе на одну ночь. Для поездки на поезде — документ, на который оформлен билет.</p></details>
          <details><summary>Как будет работать трансфер?<span class="faq-plus"></span></summary><p>После концерта едем из клуба Deus к дому на минивэне Hyundai Staria. Точку посадки и точное время сообщим перед поездкой. На плане дорога указана с 22:00 до 23:30, а тусовка — с 22:30: время прибытия уточняется.</p></details>
          <details><summary>Как сохранить дату на телефоне?<span class="faq-plus"></span></summary><p>Нажми «Сохранить дату» и выбери календарь. Apple Calendar откроет подписку на календарь праздника — подтверди её добавление. Для Android — ссылка в Google Calendar: проверь уведомление перед сохранением. Чтобы добавить событие через файл, выбери «Скачать файл события» и открой .ics в календаре; на iPhone также можно открыть вложение через Mail.</p></details>
          <details><summary>Где купить билеты на поезд?<span class="faq-plus"></span></summary><p>В разделе «Как добраться» есть ссылки на Туту для обоих направлений. Выбери 5 декабря для Москвы → Брянска и 6 декабря для обратной дороги. Сверь время поезда перед оплатой.</p></details>
        </div>
      </section>

      <section class="contact-section wrap" aria-labelledby="guest-title">
        <div class="contact-card" data-reveal>
          <div class="contact-copy">
            <span class="eyebrow">ДЛЯ ДРУЗЕЙ НАШИХ ДРУЗЕЙ</span>
            <h2 id="guest-title" class="display">НЕТ ПРИГЛАШЕНИЯ? ПРИХОДИ С ДРУГОМ.</h2>
            <p>Если тебя зовёт друг, у которого уже есть приглашение, вход для тебя:</p>
            <strong class="guest-price">1.500 р</strong>
            <p>За подробностями пиши мне в Telegram.</p>
          </div>
          <a class="button button-dark contact-button" :href="organizer.telegramUrl" target="_blank" rel="noopener noreferrer" aria-label="Написать Егору в Telegram, zavoz_contenta">
            <Icon name="telegram" />
            <span>{{ organizer.telegramHandle }}</span>
            <Icon name="arrow" />
          </a>
        </div>
      </section>

      

      <section class="closing-section" aria-labelledby="closing-title">
        <div class="wrap closing-inner" data-reveal><span class="eyebrow">ЭТОТ БИЛЕТ — ДЛЯ ТЕБЯ</span><h2 id="closing-title" class="display">18 СЛУЧАЕТСЯ<br />ОДИН РАЗ.</h2><p>Проведём его вместе.</p><button class="button button-light" @click="openCalendar">Сохранить дату <Icon name="calendar" /></button><div class="closing-meta"><span>5—6 ДЕКАБРЯ {{ year }}</span><Icon name="sparkle" /><span>БРЯНСК / СВОИ ЛЮДИ</span></div><span class="closing-18 display" aria-hidden="true">18</span></div>
      </section>
    </main>

    <footer class="site-footer wrap"><a class="wordmark" href="#main">ЕА<span> / 18</span></a><a class="footer-contact" :href="organizer.telegramUrl" target="_blank" rel="noopener noreferrer"><Icon name="telegram" /> {{ organizer.telegramHandle }}</a><a class="back-top" href="#main">НАВЕРХ <Icon name="arrow" /></a></footer>

    <dialog ref="calendarDialog" class="calendar-dialog" aria-labelledby="calendar-title" @click="e => { if (e.target === calendarDialog) calendarDialog.close() }">
      <div class="calendar-dialog-inner"><button class="dialog-close" aria-label="Закрыть выбор календаря" @click="calendarDialog.close()"><Icon name="close" /></button><span class="eyebrow">ЗАБРОНИРУЙ ЭТОТ УИКЕНД</span><h2 id="calendar-title" class="display">УВИДИМСЯ<br />5 ДЕКАБРЯ.</h2><p class="calendar-summary">5 декабря, 18:00 — 6 декабря, 11:00<br />{{ year }} · время московское</p><a class="calendar-option" :href="appleCalendarUrl"><Icon name="calendar" /><span><strong>Открыть Apple Calendar</strong><small>iPhone, iPad и Mac · подписка на календарь</small></span><Icon name="arrow" /></a><a class="calendar-option" :href="calendarUrl" target="_blank" rel="noopener noreferrer"><Icon name="calendar" /><span><strong>Google Calendar</strong><small>Android и любой браузер</small></span><Icon name="arrow" /></a><p class="calendar-help">Apple Calendar предложит подписаться на календарь праздника. В Google Calendar проверь уведомление перед сохранением. Если календарь не открылся, скачай файл события с напоминанием за сутки и импортируй его; на iPhone можно открыть его через Mail.</p><a class="ics-download" href="/egor-18.ics" download="egor-18.ics">Скачать файл события</a></div>
    </dialog>
    <Transition name="toast"><div v-if="toast" class="toast-message" role="status"><Icon name="check" />{{ toast }}</div></Transition>
    <div v-if="confetti.length" class="confetti-layer" aria-hidden="true"><i v-for="piece in confetti" :key="piece.id" :style="{ left: piece.left, '--delay': piece.delay, '--duration': piece.duration, '--rotate': piece.rotate, '--drift': piece.drift }"></i></div>
  </div>
</template>
