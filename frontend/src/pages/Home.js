import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import { usePlantContext } from '../context/PlantContext';
import { Tabs } from '../components/Tabs';
import { PlantDetail } from '../components/PlantDetail';
import { Calendar } from '../components/Calendar';
import { AddPlantModal } from '../components/AddPlantModal';

const AppContainer = styled.div`
  background: linear-gradient(45deg, #fafafa, #f0f4f8);
  min-height: 100vh;
  padding: 1rem;
  color: #333;
  font-family: sans-serif;
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  max-width: 1200px;
  margin: 2rem auto 0;
  align-items: start;
  gap: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 7rem;

  @media (max-width: 768px) {
    margin-top: 0;
  }
`;


const RightPanel = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ToggleCalendarButton = styled(motion.button)`
  margin-bottom: 1rem;
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  background-color: #ffffffcc;
  border: 2px solid #4caf50;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  &:hover {
    background-color: #e8f5e9;
    transform: scale(1.03);
  }
`;

const CalendarWrapper = styled(motion.div)`
  flex: 1;
  max-width: 600px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  width: 100%;
  box-sizing: border-box;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 0.5rem;
  color: #4caf50;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #4caf50;
  &:hover {
    color: #388e3c;
  }
`;

function HomeInner() {
  const [showModal, setShowModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [monthOffset, setMonthOffset] = useState(0);
  const calContentRef = useRef(null);
  const [calHeight, setCalHeight] = useState(0);

  const context = usePlantContext();
  if (!context) return <div>Loading...</div>;

  const { selectedId, plants, selectPlant } = context;

  useEffect(() => {
    if (!selectedId && plants.length > 0) {
      selectPlant(plants[0].id);
    }
  }, [plants, selectedId, selectPlant]);

  useEffect(() => {
    if (showCalendar && calContentRef.current) {
      setCalHeight(calContentRef.current.scrollHeight);
    } else {
      setCalHeight(0);
    }
  }, [showCalendar, plants, monthOffset]);

  const today = new Date();
  const displayDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const monthNamesPL = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
    "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];
  const monthName = monthNamesPL[displayDate.getMonth()];
  const year = displayDate.getFullYear();

  return (
    <AppContainer>
      <Tabs onAdd={() => setShowModal(true)} />

      <Content>
        <LeftPanel>
          <AnimatePresence mode="wait">
            <PlantDetail key={selectedId || 'none'} />
          </AnimatePresence>
        </LeftPanel>

        <RightPanel>
          <ToggleCalendarButton
            onClick={() => setShowCalendar(prev => !prev)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showCalendar ? 'Ukryj kalendarz 📅' : 'Pokaż kalendarz 📅'}
          </ToggleCalendarButton>

          <AnimatePresence>
            {showCalendar && (
              <CalendarWrapper
                key="calendar"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.4 }}
              >
                <div ref={calContentRef}>
                  <CalendarHeader>
                    <NavButton onClick={() => setMonthOffset(prev => prev - 1)}>←</NavButton>
                    {monthName} {year}
                    <NavButton onClick={() => setMonthOffset(prev => prev + 1)}>→</NavButton>
                  </CalendarHeader>
                  <Calendar monthOffset={monthOffset} allPlants={plants} baseDate={displayDate} />
                </div>
              </CalendarWrapper>
            )}
          </AnimatePresence>
        </RightPanel>
      </Content>

      <AnimatePresence>
        {showModal && <AddPlantModal onClose={() => setShowModal(false)} key="modal" />}
      </AnimatePresence>
    </AppContainer>
  );
}

function Home() {
  return <HomeInner />;
}

export default Home;
