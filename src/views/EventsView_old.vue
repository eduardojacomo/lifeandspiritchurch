<script setup>
import { ref, computed, onMounted } from 'vue'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

const db = getFirestore()

const currentDate = ref(new Date())
const isLoading = ref(false)

/* ===============================
   1️⃣ FONTE ÚNICA (RAW)
================================ */
const allEventsRaw = ref([])

/* ===============================
   2️⃣ BUSCA SIMPLES (SEM FILTRO)
================================ */
const loadAllEvents = async () => {
  isLoading.value = true
  try {
    const snap = await getDocs(collection(db, 'events'))

    allEventsRaw.value = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    console.log('📦 RAW EVENTS:', allEventsRaw.value)
  } catch (err) {
    console.error('❌ Firestore error:', err)
  } finally {
    isLoading.value = false
  }
}

/* ===============================
   3️⃣ NORMALIZAÇÃO (DATES)
================================ */
const events = computed(() => {
  return allEventsRaw.value.map(event => ({
    ...event,
    dateStartObj: event.dateStart
      ? new Date(event.dateStart + 'T00:00:00')
      : null,
    dateEndObj: event.dateEnd
      ? new Date(event.dateEnd + 'T23:59:59')
      : null,
    scheduleDays: (event.schedules || []).map(s =>
      new Date(s.day + 'T00:00:00')
    )
  }))
})

/* ===============================
   4️⃣ CALENDÁRIO
================================ */
const monthNames = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"]
const weekDays = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"]

const getDaysInMonth = d => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
const getFirstDayOfMonth = d => new Date(d.getFullYear(), d.getMonth(), 1).getDay()

const calendarDays = computed(() => {
  const days = []
  const firstDay = getFirstDayOfMonth(currentDate.value)
  const totalDays = getDaysInMonth(currentDate.value)

  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let d = 1; d <= totalDays; d++) days.push(d)

  return days
})

const isSameDay = (a, b) =>
  a && b &&
  a.getDate() === b.getDate() &&
  a.getMonth() === b.getMonth() &&
  a.getFullYear() === b.getFullYear()

const isToday = day => {
  const d = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), day)
  return isSameDay(new Date(), d)
}

const isDateInRange = (date, start, end) =>
  start && end && date >= start && date <= end

const hasEvent = day => {
  if (!day) return false

  const checkDate = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth(),
    day,
    12
  )

  return events.value.some(event => {
    if (event.scheduleDays?.length) {
      return event.scheduleDays.some(d => isSameDay(d, checkDate))
    }

    if (event.dateStartObj && event.dateEndObj) {
      return isDateInRange(checkDate, event.dateStartObj, event.dateEndObj)
    }

    return event.dateStartObj && isSameDay(event.dateStartObj, checkDate)
  })
}

/* ===============================
   5️⃣ EVENTOS DO MÊS
================================ */
const monthEvents = computed(() => {
  const month = currentDate.value.getMonth()
  const year = currentDate.value.getFullYear()

  return events.value.filter(event => {
    if (event.scheduleDays?.length) {
      return event.scheduleDays.some(d =>
        d.getMonth() === month && d.getFullYear() === year
      )
    }

    if (event.dateStartObj && event.dateEndObj) {
      return (
        event.dateStartObj.getMonth() === month ||
        event.dateEndObj.getMonth() === month
      )
    }

    return false
  }).sort((a, b) => a.dateStartObj - b.dateStartObj)
})

/* ===============================
   6️⃣ NAV / HELPERS
================================ */
const previousMonth = () =>
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1)

const nextMonth = () =>
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1)

const formatDate = d => {
  if (!d) return ''
  const [y,m,day] = d.split('-')
  return `${day}/${m}/${y}`
}

const getCategoryColor = category => ({
  conferencia: '#3b82f6',
  festa: '#8b5cf6',
  batismo: '#ec4899',
  encontro: '#10b981',
  culto: '#f59e0b'
}[category?.toLowerCase()] || '#6b7280')

/* ===============================
   7️⃣ MOUNT
================================ */
onMounted(loadAllEvents)
</script>

<template>
  <section class="hero-section">
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <h1 class="hero-title">Agenda de Eventos</h1>
    </div>
  </section>

  <div class="church-calendar">
    <div v-if="isLoading" class="loading-state">Carregando Agenda...</div>
    
    <div v-else class="column-content">
      <div class="calendar-container">
        <div class="calendar-header">
          <button @click="previousMonth" class="nav-button"> <font-awesome-icon icon="fa-solid fa-angle-left" /> </button>
          <h2 class="current-month">{{ monthNames[currentDate.getMonth()] }} {{ currentDate.getFullYear() }}</h2>
          <button @click="nextMonth" class="nav-button"> <font-awesome-icon icon="fa-solid fa-angle-right" /> </button>
        </div>

        <div class="calendar-grid">
          <div class="weekdays">
            <div v-for="day in weekDays" :key="day" class="weekday">{{ day }}</div>
          </div>
          <div class="days-grid">
            <div v-for="(day, index) in calendarDays" :key="index"
              :class="['day-cell', { 'empty': !day, 'today': day && isToday(day), 'has-event': day && hasEvent(day) }]">
              <span v-if="day">{{ day }}</span>
              <div v-if="day && hasEvent(day)" class="event-marker"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="list-events">
        <div class="events-section">
          <div class="events-header">
            <h3>Eventos do Mês ({{ monthEvents.length }})</h3>
          </div>

          <div v-if="monthEvents.length === 0" class="no-events">
            Nenhum evento para este mês.
          </div>

          <div v-else class="events-list">
            <div v-for="event in monthEvents" :key="event.id" class="event-card"
                 :style="{ borderLeftColor: getCategoryColor(event.category) }">
              
              <div class="event-badge" :style="{ backgroundColor: getCategoryColor(event.category) }">
                {{ event.category }}
              </div>

              <h4 class="event-title">{{ event.title.pt }}</h4>
              <p class="event-description">{{ event.description.pt }}</p>

              <div class="event-details">
                <div class="event-detail">
                  <span>📅 {{ formatDate(event.dateStart) }}</span>
                </div>
                <div class="event-detail" v-if="event.schedules?.length">
                  <span>⏰ {{ event.schedules[0].start }}h</span>
                </div>
                <div class="event-detail" v-if="event.address?.label">
                  <span>📍 {{ event.address.label }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.church-calendar {
  width: 100%;
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    padding: 0 2rem;
}


.hero-section {
  position: relative;
  /* height: 50vh; */
  min-height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  /* margin-bottom: 4rem; */
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.03) 0%, transparent 50%);
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  /* padding: 2rem; */
}

.hero-title {
  font-size: clamp(1.5rem, 8vw, 4rem);
  font-weight: 900;
  letter-spacing: -2px;
  text-transform: uppercase;
  color: var(--color-heading);
  margin: 0;
}

.calendar-container {
  background: #1a1a1a;
  border-radius: 12px;
  padding: 15px;
  border: 1px solid #2d2d2d;
  max-width: 380px;
}

.column-content {
  display: flex;
  flex-direction: row;
  gap: 2rem;
  align-items: flex-start;
  padding: 1rem;
}

.list-events {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* margin-bottom: 30px; */
}

.current-month {
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

.nav-button {
  background: transparent;
  border: 1px solid #3d3d3d;
  color: #ffffff;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-button:hover {
  background: #2d2d2d;
  border-color: #4d4d4d;
}

.calendar-grid {
  margin-bottom: 30px;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  margin-bottom: 8px;
}

.weekday {
  text-align: center;
  font-weight: 600;
  color: #9ca3af;
  font-size: 14px;
  padding: 12px 0;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.day-cell {
  position: relative;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 14px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #0d0d0d;
  border: 1px solid #2d2d2d;
}

.day-cell.empty {
  background: transparent;
  border: none;
  cursor: default;
}

.day-cell:not(.empty):hover {
  background: #2d2d2d;
  border-color: #3d3d3d;
}

.day-cell.today {
  background: #3b82f6;
  font-weight: 700;
  border-color: #3b82f6;
}

.day-cell.has-event:not(.today) {
  background: #1e1e2e;
  border-color: #8b5cf6;
}

.event-marker {
  position: absolute;
  bottom: 6px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #8b5cf6;
}

.day-cell.today .event-marker {
  background: #ffffff;
}

.events-section {
  background: #0d0d0d;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #2d2d2d;
}

.events-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.events-header svg {
  color: #8b5cf6;
}

.events-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

.no-events {
  text-align: center;
  color: #6b7280;
  padding: 40px 20px;
  font-size: 14px;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.event-card {
  background: #1a1a1a;
  border-left: 4px solid #8b5cf6;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s ease;
  position: relative;
}

.event-card:hover {
  background: #1e1e1e;
  transform: translateX(4px);
}

.event-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  color: #ffffff;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.event-status {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  background: #10b981;
  color: #ffffff;
}

.event-title {
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px 0;
}

.event-description {
  font-size: 14px;
  color: #9ca3af;
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.event-details {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.event-detail {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #6b7280;
}

.event-detail svg {
  color: #8b5cf6;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .calendar-container {
    padding: 20px;
  }
  
  .current-month {
    font-size: 20px;
  }
  
  .weekday {
    font-size: 12px;
  }
  
  .day-cell {
    font-size: 12px;
  }
  
  .event-details {
    flex-direction: column;
    gap: 8px;
  }
}
</style>