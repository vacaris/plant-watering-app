// components/Tabs.js
import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlantContext } from '../context/PlantContext';

const TabsContainer = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.1);
  padding: 0.5rem;
  backdrop-filter: blur(5px);
  overflow-x: auto;
`;

const getStatus = (plant) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const last = new Date(plant.lastWatered);
  last.setHours(0, 0, 0, 0);
  const next = new Date(last.getTime() + plant.interval * 86400000);
  const diffDays = Math.floor((next - today) / 86400000);
  if (diffDays < 0) return 'late';
  if (diffDays === 0) return 'due';
  return 'ok';
};

const TabItem = styled(motion.div)`
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  margin-right: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  background: ${({ status }) =>
    status === 'late' ? '#ffebee' :
    status === 'due' ? '#fff8e1' : '#e8f5e9'};
  border: 2px solid ${({ active }) => active ? '#4caf50' : 'transparent'};
  box-shadow: ${({ active }) => active ? '0 2px 6px rgba(0,0,0,0.1)' : 'none'};
  transition: all 0.3s ease;
`;

const Emoji = styled(motion.span)`
  font-size: 1.2rem;
  margin-right: 0.5rem;
`;

const DayCount = styled.span`
  font-size: 0.8rem;
  opacity: 0.6;
  margin-left: 0.25rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #888;
  font-size: 0.9rem;
  margin-left: 0.5rem;
  cursor: pointer;
  &:hover {
    color: #e74c3c;
  }
`;

const AddButton = styled(motion.button)`
  padding: 0.4rem 0.7rem;
  border: none;
  border-radius: 6px;
  background: rgba(255,255,255,0.3);
  cursor: pointer;
  font-size: 1.2rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: rgba(255,255,255,0.5);
  }
`;

export const Tabs = ({ onAdd }) => {
  const { plants, selectedId, selectPlant, removePlant } = usePlantContext();

  return (
    <TabsContainer>
      <AnimatePresence initial={false}>
        {plants.map(plant => {
          const status = getStatus(plant);
          const today = new Date();
          const last = new Date(plant.lastWatered);
          last.setHours(0,0,0,0);
          const next = new Date(last.getTime() + plant.interval * 86400000);
          const diffDays = Math.floor((next - today) / 86400000);

          const emoji =
            diffDays < 0 ? '🥀' :
            diffDays === 0 ? '🫗' :
            plant.emoji || '🌿';

          return (
            <TabItem
              key={plant.id}
              active={plant.id === selectedId}
              status={status}
              onClick={() => selectPlant(plant.id)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Emoji
                key={emoji}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                {emoji}
              </Emoji>
              <span>{plant.name}</span>
              <DayCount>
                {diffDays < 0 ? `${-diffDays}d po` : diffDays === 0 ? 'dziś' : `za ${diffDays}d`}
              </DayCount>
              <CloseButton onClick={(e) => {
                e.stopPropagation();
                removePlant(plant.id);
              }}>
                ×
              </CloseButton>
            </TabItem>
          );
        })}
      </AnimatePresence>
      <AddButton
        onClick={onAdd}
        whileHover={{ scale: 1.1, rotate: 45 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        +
      </AddButton>
    </TabsContainer>
  );
};
