<template>
  <div class="monthly-date-picker">
    <div class="picker-header">
      <button @click.stop="prevYear">&lt;&lt;</button>
      <button @click.stop="prevMonth">&lt;</button>
      <span class="month-year-display">
        {{ currentMonthName }} {{ currentYear }}
      </span>
      <button @click.stop="nextMonth">&gt;</button>
      <button @click.stop="nextYear">&gt;&gt;</button>
    </div>

    <div class="calendar-grid">
      <div class="day-of-week" v-for="day in displayWeekdays" :key="day">{{ day }}</div>
      <div
        class="day-cell"
        v-for="blank in startDayBlanks"
        :key="`blank-${blank}`"
      ></div>
      <div
        class="day-cell"
        :class="{
          'current-month': day.isCurrentMonth,
          'selected': day.isSelected,
          'today': day.isToday
        }"
        v-for="day in daysInMonth"
        :key="day.date.toDateString()"
        @click.stop="selectDate(day.date)"
      >
        {{ day.date.getDate() }}
      </div>
    </div>

    <div class="selection-info">
      <p v-if="selectedDate">Data selecionada: {{ formattedSelectedDate }}</p>
      <p v-else>Nenhuma data selecionada.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

// Define the weekdays object with all language options
const allWeekdays = { // Changed from 'weekdays' to 'allWeekdays' to match validator and computed property
  'pt': ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
  'en': ['S', 'M', 'T', 'W', 'T', 'F', 'S']
};

const props = defineProps({
  initialDate: {
    type: Date,
    default: () => new Date(),
  },
  lang: {
    type: String,
    default: 'pt'
  }
});

const emit = defineEmits(['date-selected']);

const currentViewDate = ref(new Date(props.initialDate.getFullYear(), props.initialDate.getMonth(), 1));
const selectedDate = ref(null);

const displayWeekdays = computed(() => {
  // Use a fallback to 'pt-BR' if the specified lang is not found
  return allWeekdays[props.lang] || allWeekdays['pt-BR'];
});

const currentMonthName = computed(() => {
  // Use props.lang for localization of month name
  return currentViewDate.value.toLocaleString(props.lang, { month: 'long' });
});

const currentYear = computed(() => {
  return currentViewDate.value.getFullYear();
});

const startDayBlanks = computed(() => {
  const firstDayOfMonth = new Date(currentViewDate.value.getFullYear(), currentViewDate.value.getMonth(), 1);
  return firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday, etc.
});

const daysInMonth = computed(() => {
  const year = currentViewDate.value.getFullYear();
  const month = currentViewDate.value.getMonth();
  const numDays = new Date(year, month + 1, 0).getDate(); // Get number of days in current month

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today's date

  const days = [];
  for (let i = 1; i <= numDays; i++) {
    const date = new Date(year, month, i);
    date.setHours(0, 0, 0, 0); // Normalize date for comparison

    days.push({
      date: date,
      isCurrentMonth: true,
      isSelected: selectedDate.value && selectedDate.value.toDateString() === date.toDateString(),
      isToday: today.toDateString() === date.toDateString(),
    });
  }
  return days;
});

const formattedSelectedDate = computed(() => {
  if (selectedDate.value) {
    // Use props.lang for localization of the selected date format
    return selectedDate.value.toLocaleDateString(props.lang);
  }
  return '';
});

// --- Métodos ---
const prevMonth = () => {
  currentViewDate.value = new Date(currentViewDate.value.getFullYear(), currentViewDate.value.getMonth() - 1, 1);
};

const nextMonth = () => {
  currentViewDate.value = new Date(currentViewDate.value.getFullYear(), currentViewDate.value.getMonth() + 1, 1);
};

const prevYear = () => {
  currentViewDate.value = new Date(currentViewDate.value.getFullYear() - 1, currentViewDate.value.getMonth(), 1);
};

const nextYear = () => {
  currentViewDate.value = new Date(currentViewDate.value.getFullYear() + 1, currentViewDate.value.getMonth(), 1);
};

const selectDate = (date) => {
  selectedDate.value = date;
  emit('date-selected', date); // Emit the selected date
};

// --- Watchers ---
watch(() => props.initialDate, (newDate) => {
  currentViewDate.value = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
  selectedDate.value = null; // Reset selected date when initialDate changes
}, { immediate: true }); // Executa imediatamente na montage
</script>

<style scoped>

.monthly-date-picker {
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 15px;
  width: 230px;
  margin: 20px auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: var(--color-background);
}

.picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  background-color: var(--color-background-soft);
  padding: 8px 10px;
  border-radius: 5px;
}

.picker-header button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 6px 8px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s ease;
}

.picker-header button:hover {
  background-color: #0056b3;
}

.month-year-display {
  font-weight: bold;
  font-size: 1.1em;
  text-transform: capitalize;
  color: var(--color-heading);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  text-align: center;
}

.day-of-week {
  font-weight: bold;
  color: var(--color-text);
  padding: 5px 0;
  border-bottom: 1px solid var(--color-background-soft);
}

.day-cell {
  padding: 10px 0;
  cursor: pointer;
  width: 24px;
  height: 32px;
  border-radius: 5px;
  transition: background-color 0.2s ease, color 0.2s ease;
  background-color: #3b3b3b;
  color: #666;
}

.day-cell.current-month {
  color: var(--color-heading);
  background-color: var(--color-background-mute);
}

.day-cell.selected {
  background-color: #28a745;
  color: white;
  font-weight: bold;
  box-shadow: 0 2px 5px rgba(0, 123, 255, 0.3);
}

.day-cell.today {
  border: 2px solid #007bff;
  background-color: #e6f7ff;
  color: #007bff;
}

.selection-info {
  margin-top: 20px;
  padding: 10px;
  background-color: var(--color-background-mute);
  border-radius: 5px;
  border: 1px solid var(--color-border);
}

.selection-info p {
  margin: 0;
  color: var(--cor-azul-claro);
  font-weight: bold;
}
</style>