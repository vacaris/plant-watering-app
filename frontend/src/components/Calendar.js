import React, { useMemo } from 'react';
import styled from 'styled-components';

const CalendarContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 1rem;
  background: #fafafa;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;

const Weekdays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: bold;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
  color: #666;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: #ccc;
`;

const DayCell = styled.div`
  background: #fefefe;
  min-height: 60px;
  text-align: left;
  font-size: 0.9rem;
  border: 1px solid #eee;
  padding: 4px;
  box-sizing: border-box;
  position: relative;
  ${props => props.overdue ? 'background: #ffebee;' :
    props.today && props.event ? 'background: #fff3e0;' :
    props.today ? 'background: #e3f2fd;' : ''}
`;

const DayNumber = styled.div`
  font-size: 0.8rem;
  opacity: 0.8;
`;

const EmojiGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 4px;
`;


const EmojiItem = styled.div`
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  position: relative;

  &:hover::after {
    content: attr(data-label);
    position: absolute;
    top: -1.5rem;
    left: 0;
    background: #333;
    color: #fff;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.65rem;
    white-space: nowrap;
    z-index: 10;
  }
`;


export const Calendar = ({ monthOffset = 0, allPlants = [] }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const baseDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  let startOffset = firstDayOfMonth.getDay();
  startOffset = startOffset === 0 ? 6 : startOffset - 1;
  const totalCells = Math.ceil((daysInMonth + startOffset) / 7) * 7;

  const events = useMemo(() => {
    const result = [];
    for (const plant of allPlants) {
      if (plant.lastWatered && plant.interval) {
        const interval = plant.interval;
        const lastWaterDate = new Date(plant.lastWatered);
        lastWaterDate.setHours(0, 0, 0, 0);

        let dueDate = new Date(lastWaterDate);
        while (dueDate < firstDayOfMonth) {
          dueDate = new Date(dueDate.getTime() + interval * 86400000);
        }
        while (dueDate <= lastDayOfMonth) {
          result.push({ date: new Date(dueDate), emoji: plant.emoji, name: plant.name });
          dueDate = new Date(dueDate.getTime() + interval * 86400000);
        }
      }
    }
    return result;
  }, [allPlants, month, year]);

  const eventMap = useMemo(() => {
    const map = new Map();
    for (const e of events) {
      const key = e.date.toISOString().slice(0, 10);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push({ emoji: e.emoji, name: e.name });
    }
    return map;
  }, [events]);

  const cells = [];
  for (let i = 0; i < totalCells; i++) {
    const dayNum = i - startOffset + 1;
    let dateObj = null;
    let label = '';
    if (i >= startOffset && dayNum <= daysInMonth) {
      dateObj = new Date(year, month, dayNum);
      label = dayNum.toString();
    }
    cells.push({ date: dateObj, label });
  }

  return (
    <CalendarContainer>
      <Weekdays>
        {['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb', 'Nd'].map((d, i) => <div key={i}>{d}</div>)}
      </Weekdays>

      <CalendarGrid>
        {cells.map((cell, idx) => {
          const dateObj = cell.date;
          const label = cell.label;
          const isoDate = dateObj ? dateObj.toISOString().slice(0, 10) : null;
          const events = isoDate ? eventMap.get(isoDate) : [];
          const isToday = dateObj && dateObj.toDateString() === today.toDateString();
          const isEvent = events && events.length > 0;
          const isOverdue = isEvent && dateObj < today;

          return (
            <DayCell key={idx} today={isToday} event={isEvent} overdue={isOverdue}>
              {label && <DayNumber>{label}</DayNumber>}
              {label && isEvent && (
                <EmojiGroup>
                  {events.map((item, i) => (
                    <EmojiItem key={i} data-label={item.name}>
                      <span>{item.emoji}</span>
                    </EmojiItem>
                  ))}
                </EmojiGroup>
              )}
            </DayCell>
          );
        })}
      </CalendarGrid>
    </CalendarContainer>
  );
};
