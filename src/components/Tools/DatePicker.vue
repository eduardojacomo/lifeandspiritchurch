<script setup>
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { useLanguage } from '@/stores/languageStore';

const { t } = useI18n();
const uselanguage = useLanguage();
const { currentLocaleKey, locale } = storeToRefs(uselanguage);

const allWeekdays = {
  'pt': ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
  'en': ['S', 'M', 'T', 'W', 'T', 'F', 'S']
};

const monthAbbreviations = {
  'pt': ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  'en': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
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

const emit = defineEmits(['date-selected', 'date-selected-iso']);

const currentViewDate = ref(new Date(props.initialDate.getFullYear(), props.initialDate.getMonth(), 1));
const selectedDate = ref(null);
const selectedDateISO = ref(null);

const currentCalendarView = ref('day'); 

const yearsBlockStartYear = ref(new Date().getFullYear()); 
const numberOfYearsToShow = 12;

// --- Computed Properties ---
const displayWeekdays = computed(() => {
  return allWeekdays[props.lang] || allWeekdays['pt'];
});

const currentMonthName = computed(() => {
  return currentViewDate.value.toLocaleString(props.lang, { month: 'long' });
});

const currentYear = computed(() => {
  return currentViewDate.value.getFullYear();
});

const displayMonths = computed(() => {
  return monthAbbreviations[props.lang] || monthAbbreviations['pt'];
});

const displayYears = computed(() => {
  const currentSystemYear = new Date().getFullYear(); 
  const years = [];

  let startYear = yearsBlockStartYear.value;
  if (startYear > currentSystemYear) {
      startYear = currentSystemYear;
      yearsBlockStartYear.value = currentSystemYear; 
  }

  for (let i = 0; i < numberOfYearsToShow; i++) {
    const yearToAdd = startYear - i;
    if (yearToAdd <= currentSystemYear) {
      years.push(yearToAdd);
    }
  }
  return years.sort((a, b) => a - b); 
});


const startDayBlanks = computed(() => {
  if (currentCalendarView.value !== 'day') return 0;
  const firstDayOfMonth = new Date(currentViewDate.value.getFullYear(), currentViewDate.value.getMonth(), 1);
  return firstDayOfMonth.getDay();
});

const daysInMonth = computed(() => {
  if (currentCalendarView.value !== 'day') return [];

  const year = currentViewDate.value.getFullYear();
  const month = currentViewDate.value.getMonth();
  const numDays = new Date(year, month + 1, 0).getDate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = [];
  for (let i = 1; i <= numDays; i++) {
    const date = new Date(year, month, i);
    date.setHours(0, 0, 0, 0);

    days.push({
      date,
      isCurrentMonth: true,
      isSelected: selectedDate.value && selectedDate.value.toDateString() === date.toDateString(),
      isToday: today.toDateString() === date.toDateString(),
      isPastOrToday: date <= today
    });
  }
  return days;
});

const formattedSelectedDate = computed(() => {
  if (selectedDate.value) {
    return selectedDate.value.toLocaleDateString(props.lang);
  }
  return '';
});

function prevMonth() {
  const currentSystemYear = new Date().getFullYear();
  if (currentCalendarView.value === 'day') {
    currentViewDate.value = new Date(currentViewDate.value.getFullYear(), currentViewDate.value.getMonth() - 1, 1);
  } else if (currentCalendarView.value === 'month') {
    currentViewDate.value = new Date(currentViewDate.value.getFullYear() - 1, currentViewDate.value.getMonth(), 1);
  } else if (currentCalendarView.value === 'year') {
    const backBlockPotentialStartYear = yearsBlockStartYear.value - numberOfYearsToShow;
    console.log(backBlockPotentialStartYear);
    if (backBlockPotentialStartYear <= (currentSystemYear - numberOfYearsToShow + 1)) {
        yearsBlockStartYear.value = backBlockPotentialStartYear;
    } else {
        yearsBlockStartYear.value = currentSystemYear;
    }
    // yearsBlockStartYear.value += numberOfYearsToShow;
  }
};

function nextMonth (){
  const currentSystemYear = new Date().getFullYear();
  if (currentCalendarView.value === 'day') {
    currentViewDate.value = new Date(currentViewDate.value.getFullYear(), currentViewDate.value.getMonth() + 1, 1);
  } else if (currentCalendarView.value === 'month') {
    currentViewDate.value = new Date(currentViewDate.value.getFullYear() + 1, currentViewDate.value.getMonth(), 1);
  } else if (currentCalendarView.value === 'year') {
    const nextBlockPotentialStartYear = yearsBlockStartYear.value - numberOfYearsToShow;
    if (nextBlockPotentialStartYear >= (currentSystemYear - numberOfYearsToShow + 1)) {
        yearsBlockStartYear.value = nextBlockPotentialStartYear;
    } else {
        yearsBlockStartYear.value = currentSystemYear;
    }
  }
};

const showMonths = () => {
  currentCalendarView.value = 'month';
};

const showYears = () => {
  currentCalendarView.value = 'year';
  yearsBlockStartYear.value = new Date().getFullYear();
};

const selectDate = (date) => {
  selectedDate.value = date;
  selectedDateISO.value = date.toISOString();
};

const selectMonth = (monthIndex) => {
  currentViewDate.value = new Date(currentViewDate.value.getFullYear(), monthIndex, 1);
  currentCalendarView.value = 'day'; 
};

const selectYear = (year) => {
  currentViewDate.value = new Date(year, currentViewDate.value.getMonth(), 1);
  currentCalendarView.value = 'day'; 
};

function confirmDate(){
  if (selectedDate.value && selectedDateISO.value) {
    emit('date-selected', selectedDate.value);
    emit('date-selected-iso', selectedDateISO.value);
  } else {
    console.warn("Nenhuma data selecionada para confirmar.");
  }
}

const canGoNextInYearView = computed(() => {
  return yearsBlockStartYear.value < new Date().getFullYear();
});


// --- Watchers ---
watch(() => props.initialDate, (newDate) => {
  currentViewDate.value = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
  selectedDate.value = null;
  selectedDateISO.value = null;
  currentCalendarView.value = 'day'; 
  yearsBlockStartYear.value = new Date().getFullYear();
}, { immediate: true });
</script>

<template>
  <div class="monthly-date-picker">
    <div class="picker-header">
      <div>
        <button @click.stop="showMonths">
          {{ currentMonthName }}
        </button>
        <button @click.stop="showYears">
          {{ currentYear }}
        </button>
      </div>

      <div>
        <button @click.stop="prevMonth">&lt;</button>
        <button
            @click.stop="nextMonth"
            :disabled="currentCalendarView === 'year' && !canGoNextInYearView"
        >&gt;</button>
      </div>
    </div>

    <div class="calendar-grid" v-if="currentCalendarView === 'day'">
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
          'today': day.isToday,
          'disabled': !day.isPastOrToday,
          'enabled' : day.isPastOrToday
        }"
        v-for="day in daysInMonth"
        :key="day.date.toDateString()"
        @click.stop="day.isPastOrToday && selectDate(day.date)"
      >
        {{ day.date.getDate() }}
      </div>
    </div>

    <div class="calendar-grid months-view" v-else-if="currentCalendarView === 'month'">
      <div
        class="month-cell"
        :class="{ 'selected': currentViewDate.getMonth() === index }"
        v-for="(month, index) in displayMonths"
        :key="month"
        @click.stop="selectMonth(index)"
      >
        {{ month }}
      </div>
    </div>

    <div class="calendar-grid years-view" v-else-if="currentCalendarView === 'year'">
      <div
        class="year-cell"
        :class="{ 'selected': currentViewDate.getFullYear() === year }"
        v-for="year in displayYears"
        :key="year"
        @click.stop="selectYear(year)"
      >
        {{ year }}
      </div>
    </div>

    <div class="selection-info">
      <p v-if="selectedDate">{{ t('_dateSelectedText') }} {{ formattedSelectedDate }}</p>
      <p v-else>{{ t('_noDateSelectedText') }}</p>
      <button @click.stop="confirmDate()" v-if="selectedDate">Ok</button>
    </div>
  </div>
</template>

<style scoped>
/* Estilos existentes */
.monthly-date-picker {
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 15px;
  width: 240px; /* Largura fixa do datepicker */
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
  gap: 7px;
}

.picker-header button {
  background-color: transparent;
  color: white;
  border: none;
  padding: 8px 8px;
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
  font-size: 1rem;
  text-transform: capitalize;
  color: var(--color-heading);
}

/* Estilos da grid (aplicado a todas as visualizações) */
.calendar-grid {
  display: grid;
  gap: 5px;
  text-align: center;
}

/* Estilos específicos para visualização de dias */
.calendar-grid {
  grid-template-columns: repeat(7, 1fr);
}

.day-of-week {
  font-weight: bold;
  color: var(--color-text);
  padding: 5px 0;
  border-bottom: 1px solid var(--color-background-soft);
}

.day-cell {
  padding: 10px 0;
  width: 24px; /* Largura fixa para manter o grid uniforme */
  height: 32px; /* Altura fixa para manter o grid uniforme */
  border-radius: 5px;
  transition: background-color 0.2s ease, color 0.2s ease;
  color: #666;
}

.day-cell.disabled {
  background-color: #a8a8a8;
  color: #999;
  cursor: not-allowed;
  pointer-events: none; /* Desabilita cliques */
  opacity: 0.6;
}

.day-cell.enabled {
  cursor: pointer;
  background-color: var(--color-background) !important;
}

.day-cell.enabled:hover {
  cursor: pointer;
  background-color: var(--color-background-soft) !important;
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

/* Estilos para visualização de meses e anos */
.months-view, .years-view {
  grid-template-columns: repeat(3, 1fr); /* 3 colunas para meses/anos */
}

.month-cell, .year-cell {
  padding: 15px 5px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
  background-color: var(--color-background-mute);
  color: var(--color-heading);
  font-weight: bold;
  font-size: 0.9rem;
}

.month-cell:hover, .year-cell:hover {
  background-color: #007bff;
  color: white;
}

.month-cell.selected, .year-cell.selected {
  background-color: #28a745;
  color: white;
}

/* Estilos da info de seleção */
.selection-info {
  display: flex;
  flex-direction: row;
  justify-content: space-between; /* Espaçamento entre texto e botão */
  align-items: center;
  margin-top: 20px;
  padding: 10px;
  background-color: var(--color-background-mute);
  border-radius: 5px;
  border: 1px solid var(--color-border);
}

.selection-info button {
  border: solid 1px var(--color-border);
  border-radius: 5px;
  padding: .5rem;
  cursor: pointer;
  background-color: #007bff;
  color: var(--color-heading); /* Corrigido para uma cor que combine com o tema */
  transition: all .3s ease;
}

.selection-info button:hover {
  background-color: #0056b3;
}

.selection-info p {
  margin: 0;
  color: var(--cor-azul-claro); 
  font-weight: bold;
  flex-grow: 1; 
  font-size: .8rem;
}
</style>