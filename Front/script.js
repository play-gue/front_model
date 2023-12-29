document.addEventListener('DOMContentLoaded', function() {
  // 현재 날짜 설정
  let currentDate = new Date();

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
  document.getElementById('runButton').addEventListener('click', function() {
    // inputData와 selectModel 값을 가져와서 처리하는 로직을 추가
    // const inputData = document.getElementById('inputData').value;
    // const selectModel = document.getElementById('selectModel').value;
    
    // 결과를 showResult에 표시
    document.getElementById('showResult').textContent = '계산 중 입니당';;

    const data = "2023.06.13~2023.06.18, 2023.07.13~2023.07.17, 2023.08.14~2023.08.19, 2023.09.14~2023.09.19, 2023.10.15~2023.10.21, 2023.11.16~2023.11.22, 2023.12.21~2023.12.25";
    fetch('/sendData',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())  // JSON 형태로 응답 변환
        .then(data => {
            if (data.pythonData) {
                // 받은 데이터를 selectedDateAlert2에 표시
                document.getElementById('showResult').textContent = `${data.pythonData}`;
            }
            if (data.error) {
                // 에러가 있을 경우 selectedDateAlert2에 에러 표시
                document.getElementById('showResult').textContent = data.error;
            }
        })
        .catch(error => {
            console.error('에러 발생:', error);
        });
    
  });
});