const calendar = document.getElementById('calendar');
const currentMonth = document.getElementById('currentMonth');
const firstSelectedDate = document.getElementById('firstSelectedDate');
const secondSelectedDate = document.getElementById('secondSelectedDate');
const selectedPeriod = document.getElementById('selectedPeriod');
const prevMonth = document.getElementById('prevMonth');
const nextMonth = document.getElementById('nextMonth');

let currentDate = dayjs();
let firstDate = null;
let secondDate = null;

function renderCalendar(month) {
  calendar.innerHTML = '';
  currentMonth.textContent = month.format('MMMM YYYY');
  const startDay = month.startOf('month').day();
  const daysInMonth = month.daysInMonth();

  for (let i = 0; i < startDay; i++) {
    calendar.insertAdjacentHTML('beforeend', `<div class="calendar-day"></div>`);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const dayElement = document.createElement('div');
    dayElement.classList.add('calendar-day');
    dayElement.textContent = i;
    dayElement.dataset.date = month.date(i).format('YYYY-MM-DD');
    dayElement.addEventListener('click', selectDate);
    calendar.appendChild(dayElement);
  }

  updateSelection();
}

function selectDate(event) {
  const selected = dayjs(event.currentTarget.dataset.date);
  if (!firstDate || secondDate) {
    firstDate = selected;
    secondDate = null;
  } else if (selected.isBefore(firstDate) || selected.isSame(firstDate, 'day')) {
    secondDate = firstDate;
    firstDate = selected;
  } else {
    secondDate = selected;
  }

  updateSelection();
}

function updateSelection() {
  const calendarDays = document.querySelectorAll('.calendar-day');
  calendarDays.forEach(day => {
    const dayDate = dayjs(day.dataset.date);
    day.classList.remove('selected', 'selected-range');

    if (firstDate && dayDate.isSame(firstDate, 'day')) {
      day.classList.add('selected');
      firstSelectedDate.textContent = `처음 클릭한 날짜: ${firstDate.format('YYYY-MM-DD')}`;
    } else {
      firstSelectedDate.textContent = '처음 클릭한 날짜 출력';
    }

    if (secondDate && dayDate.isSame(secondDate, 'day')) {
      day.classList.add('selected');
      secondSelectedDate.textContent = `다음 클릭한 날짜: ${secondDate.format('YYYY-MM-DD')}`;
    } else if (!secondDate) {
      secondSelectedDate.textContent = '다음 클릭한 날짜 출력';
    }

    if (firstDate && secondDate && dayDate.isAfter(firstDate) && dayDate.isBefore(secondDate)) {
      day.classList.add('selected-range');
      selectedPeriod.textContent = `처음 날짜와 다음날짜의 기간: ${firstDate.format('YYYY-MM-DD')} - ${secondDate.format('YYYY-MM-DD')}`;
    } else if (!secondDate || firstDate.isSame(secondDate)) {
      selectedPeriod.textContent = '처음 날짜와 다음날짜의 기간';
    }
  });

  if (secondDate) {
    setTimeout(() => {
      firstDate = null;
      secondDate = null;
      updateSelection();
    }, 3000);
  }
}

prevMonth.addEventListener('click', () => {
  currentDate = currentDate.subtract(1, 'month');
  renderCalendar(currentDate);
});

nextMonth.addEventListener('click', () => {
  currentDate = currentDate.add(1, 'month');
  renderCalendar(currentDate);
});

renderCalendar(currentDate);
