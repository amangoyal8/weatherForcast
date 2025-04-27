const eventsByDate = {};
sortedData.forEach(item => {
  const date = new Date(item.date);
  const formattedDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth()).padStart(2, '0')}-${date.getFullYear().toString().slice(-2)}`;
  eventsByDate[formattedDate] = item;
});
const year = currentDate.getFullYear();
const month = currentDate.getMonth();
const firstDayOfMonth = new Date(year, month, 1).getDay();
const daysInMonth = new Date(year, month + 1, 0).getDate();


const handlePrevMonth = () => {
  setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
};

const handleNextMonth = () => {
  setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
};

const renderCalendar = () => {
  const weeks = [];
  let days = [];

  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<td key={`empty-${i}`}></td>);
  }
  console.log(eventsByDate, "events by date")
  for (let day = 1; day <= daysInMonth; day++) {
    // console.log(day)

    const date = new Date(year, month - 1, day); // month is 0-indexed
    date.setDate(date.getDate());

    const validDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getFullYear()).slice(-2)}`;

    const weather = eventsByDate[validDate];
    days.push(
      <td
        key={day}
        style={{
          backgroundColor: weather ? '#90ee90' : '',
          cursor: weather ? 'pointer' : 'default',
          borderRadius: '8px',
          padding: '8px'
        }}
        onClick={() => {
          if (weather) {
            alert(`Date: ${day}\nCondition: ${weather.condition}\nHumidity: ${weather.humidity}`);
          }
        }}
      >
        {day}
      </td>
    );
    if (days.length === 7) {
      weeks.push(<tr key={`week-${day}`}>{days}</tr>);
      days = [];
    }
  }

  if (days.length > 0) {
    while (days.length < 7) {
      days.push(<td key={`empty-end-${days.length}`}></td>);
    }
    weeks.push(<tr key="last-week">{days}</tr>);
  }

  return weeks;
};

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
 








<h2>Calender</h2>
          <h2>{monthNames[month]} {year}</h2>
          <button onClick={handlePrevMonth}>Prev</button>
          <button onClick={handleNextMonth} style={{ marginLeft: '10px' }}>Next</button>
          <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <th key={day} style={{ padding: '5px' }}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {renderCalendar()}
            </tbody>
          </table>