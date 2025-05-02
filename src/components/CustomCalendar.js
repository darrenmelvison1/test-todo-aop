'use client';

import React, { useState } from 'react';

// Using inline styles instead of Tailwind classes
const styles = {
  calendarContainer: {
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '16px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  calendarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  calendarTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#2d3748',
  },
  navigationButton: {
    background: 'none',
    border: '1px solid #e2e8f0',
    borderRadius: '4px',
    padding: '4px 8px',
    cursor: 'pointer',
    color: '#4a5568',
  },
  weekdaysRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '4px',
    marginBottom: '8px',
  },
  weekday: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#4a5568',
    padding: '8px 0',
  },
  daysGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '4px',
  },
  dayCell: {
    height: '40px',
    border: '1px solid #e2e8f0',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    cursor: 'pointer',
  },
  today: {
    backgroundColor: '#ebf8ff',
    borderColor: '#3182ce',
    color: '#3182ce',
    fontWeight: 'bold',
  },
  otherMonth: {
    color: '#a0aec0',
    backgroundColor: '#f7fafc',
  },
  hasTasks: {
    borderBottom: '3px solid #48bb78',
  },
  selectedDay: {
    backgroundColor: '#3182ce',
    color: 'white',
    borderColor: '#2c5282',
  },
  taskIndicator: {
    position: 'absolute',
    bottom: '4px',
    width: '20px',
    height: '3px',
    borderRadius: '1px',
  },
  taskList: {
    marginTop: '16px',
    borderTop: '1px solid #e2e8f0',
    paddingTop: '16px',
  },
  taskListTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#2d3748',
  },
  taskItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px',
    borderBottom: '1px solid #e2e8f0',
  },
  taskCheckbox: {
    marginRight: '8px',
  },
  taskText: {
    flex: 1,
  },
  taskCompleted: {
    textDecoration: 'line-through',
    color: '#a0aec0',
  },
};

// Helper functions
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

function formatDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function isSameDay(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() && 
         date1.getMonth() === date2.getMonth() && 
         date1.getDate() === date2.getDate();
}

export default function CustomCalendar({ tasks }) {
  // No TypeScript typing
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };
  
  // Next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };
  
  // Select a date
  const selectDate = (day) => {
    setSelectedDate(new Date(currentYear, currentMonth, day));
  };
  
  // Get tasks for selected date
  const getTasksForSelectedDate = () => {
    if (!tasks) return [];
    
    const selectedDateStr = formatDate(selectedDate);
    return tasks.filter(task => {
      // This assumes task has a dueDate property
      if (!task.dueDate) return false;
      
      const taskDate = new Date(task.dueDate);
      return isSameDay(taskDate, selectedDate);
    });
  };
  
  // Check if a day has tasks
  const dayHasTasks = (day) => {
    if (!tasks) return false;
    
    const checkDate = new Date(currentYear, currentMonth, day);
    return tasks.some(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return isSameDay(taskDate, checkDate);
    });
  };
  
  // Generate calendar days
  const generateCalendarDays = () => {
    const calendarDays = [];
    const today = new Date();
    
    // Previous month days
    for (let i = 0; i < firstDayOfMonth; i++) {
      const prevMonthDays = getDaysInMonth(currentYear, currentMonth - 1);
      const day = prevMonthDays - firstDayOfMonth + i + 1;
      calendarDays.push(
        <div 
          key={`prev-${day}`} 
          style={{...styles.dayCell, ...styles.otherMonth}}
        >
          {day}
        </div>
      );
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = isSameDay(new Date(currentYear, currentMonth, day), today);
      const isSelected = isSameDay(new Date(currentYear, currentMonth, day), selectedDate);
      const hasTask = dayHasTasks(day);
      
      const dayStyle = {
        ...styles.dayCell,
        ...(isToday ? styles.today : {}),
        ...(isSelected ? styles.selectedDay : {}),
        ...(hasTask ? styles.hasTasks : {})
      };
      
      calendarDays.push(
        <div 
          key={`current-${day}`} 
          style={dayStyle}
          onClick={() => selectDate(day)}
        >
          {day}
        </div>
      );
    }
    
    // Next month days
    const totalDaysShown = calendarDays.length;
    const remainingDays = 42 - totalDaysShown; // 6 rows of 7 days
    
    for (let day = 1; day <= remainingDays; day++) {
      calendarDays.push(
        <div 
          key={`next-${day}`} 
          style={{...styles.dayCell, ...styles.otherMonth}}
        >
          {day}
        </div>
      );
    }
    
    return calendarDays;
  };
  
  // Tasks for selected date
  const selectedDateTasks = getTasksForSelectedDate();
  
  return (
    <div style={styles.calendarContainer}>
      <div style={styles.calendarHeader}>
        <button style={styles.navigationButton} onClick={prevMonth}>{'<'}</button>
        <h2 style={styles.calendarTitle}>
          {monthNames[currentMonth]} {currentYear}
        </h2>
        <button style={styles.navigationButton} onClick={nextMonth}>{'>'}</button>
      </div>
      
      <div style={styles.weekdaysRow}>
        {weekdays.map(weekday => (
          <div key={weekday} style={styles.weekday}>{weekday}</div>
        ))}
      </div>
      
      <div style={styles.daysGrid}>
        {generateCalendarDays()}
      </div>
      
      <div style={styles.taskList}>
        <h3 style={styles.taskListTitle}>
          Tasks for {selectedDate.toLocaleDateString()}
        </h3>
        
        {selectedDateTasks.length === 0 ? (
          <p>No tasks for this date.</p>
        ) : (
          selectedDateTasks.map(task => (
            <div key={task.id} style={styles.taskItem}>
              <input 
                type="checkbox" 
                checked={task.completed} 
                style={styles.taskCheckbox}
                readOnly 
              />
              <span style={task.completed ? {...styles.taskText, ...styles.taskCompleted} : styles.taskText}>
                {task.text}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 