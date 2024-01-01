document.addEventListener('DOMContentLoaded', function() {
  // 현재 날짜 설정
  let currentDate = new Date();
  let clickCount = 0;
  let clickedDates = [];
  function updateCalendarTitle() {
    const calendarTitle = document.getElementById('calendarTitle');
    calendarTitle.textContent = `${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월`;
  }

  function getFirstDayOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  }

  function getLastDateOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  function clearCalendar() {
    const calendar = document.querySelector('.calendar table');
    const rows = calendar.querySelectorAll('tr:not(:first-child)');
    rows.forEach(row => row.remove());
  }

  function renderCalendar() {
    clearCalendar();
    const startDay = getFirstDayOfMonth(currentDate);
    const lastDate = getLastDateOfMonth(currentDate);
    const calendar = document.querySelector('.calendar table');
    let date = 1;

    for (let i = 0; i < 6; i++) { // 최대 6주
      const row = calendar.insertRow();
      for (let j = 0; j < 7; j++) { // 일주일 7일
        if (i === 0 && j < startDay) {
          row.insertCell(); // 빈 셀 삽입
        } else if (date > lastDate) {
          break; // 마지막 날짜 이후면 종료
        } else {
          const cell = row.insertCell();
          cell.textContent = date;
          if (j === 0) { // 일요일에 색상 변경
            cell.classList.add('sunday');
          }
          cell.addEventListener('click', function() {
            const cells = document.querySelectorAll('.calendar table td');
            clickCount++;
  
            if (clickCount === 1) {
              cells.forEach(cell => {
                cell.classList.remove('clicked', 'selected-range');
              });
            }
            
            clickedDates.push(`${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월 ${cell.textContent}일`);
            
            // 클릭한 날짜에 클래스 추가
            cell.classList.add('clicked');
            
            if (clickCount === 2) {
              // 두 번째 클릭 시 기간에 해당하는 셀에 클래스 추가
              const [startDate, endDate] = clickedDates.map(date => date.split(' ').slice(1, 4).join(' '));
              
              console.log('클릭한 날짜:', clickedDates.join(', '));
              const dataToSend = {
                clickedDates: clickedDates
              };
              
              fetch('/sendData', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(dataToSend)
              })
              .then(response => response.json())
              .then(responseData => {
                  // 서버의 응답을 처리하거나 필요에 따라 다른 동작 수행
                console.log('서버 응답:', responseData);
                });

                // 초기화
                clickCount = 0;
                clickedDates = [];
              }
            });
          date++;
        }
      }
    }
  }

  function changeMonth(offset) {
    currentDate.setMonth(currentDate.getMonth() + offset);
    updateCalendarTitle();
    renderCalendar();
  }

  document.getElementById('prevMonth').addEventListener('click', function() {
    changeMonth(-1);
  });

  document.getElementById('nextMonth').addEventListener('click', function() {
    changeMonth(1);
  });

  updateCalendarTitle();
  renderCalendar();

  // 'RUN' 버튼 클릭 이벤트
  document.getElementById('runButton').addEventListener('click', async function() {
    document.getElementById('showResult').textContent = '계산 중 입니당';

    try {
      const response = await fetch('/runPython', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({})  // 데이터가 필요하지 않는 경우 빈 객체 전송
      });
  
      if (!response.ok) {
          throw new Error(`서버 응답 오류: ${response.statusText}`);
      }
  
      const responseData = await response.json();
  
      if (responseData.pythonData) {
          document.getElementById('showResult').textContent = `${responseData.pythonData}`;
      }
      if (responseData.error) {
          document.getElementById('showResult').textContent = responseData.error;
      }
    } catch (error) {
        console.error('클라이언트 에러:', error);
        document.getElementById('showResult').textContent = `클라이언트 에러: ${error.message}`;
    }
  });
});