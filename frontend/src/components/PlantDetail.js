import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlantContext } from '../context/PlantContext';

const DetailContainer = styled(motion.div)`
  width: 320px;
  background: #eaf7ec;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const EmojiDisplay = styled.div`
  font-size: 4rem;
  margin-bottom: 0.5rem;
`;

const StatusText = styled.p`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: ${props =>
    props.status === 'late' ? '#d32f2f' :
    props.status === 'due' ? '#f57c00' :
    '#2e7d32'};
`;

const DaysCounter = styled.div`
  font-size: 0.85rem;
  color: #555;
  margin-bottom: 1rem;
`;

const WaterButton = styled(motion.button)`
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 1rem;
  &:hover {
    background: #388e3c;
  }
`;

const FeedbackMessage = styled(motion.div)`
  margin-top: 1rem;
  color: #4caf50;
  font-weight: bold;
`;

const InfoRow = styled.div`
  font-size: 0.9rem;
  margin-top: 0.4rem;
  text-align: center;
  color: #444;
`;

const lightDescriptions = {
  sun: '☀️ pełne słońce',
  part: '🌤️ półcień',
  shade: '🌑 cień',
};

export const PlantDetail = () => {
  const { plants, selectedId, waterPlant } = usePlantContext();
  const [feedback, setFeedback] = useState('');

  if (!selectedId) {
    return <DetailContainer status="ok">Brak wybranej rośliny.</DetailContainer>;
  }

  const plant = plants.find(p => p.id === selectedId);
  if (!plant) {
    return <DetailContainer status="ok">Brak danych rośliny.</DetailContainer>;
  }

  const lastWaterDate = new Date(plant.lastWatered);
  lastWaterDate.setHours(0, 0, 0, 0);
  const nextDueDate = new Date(lastWaterDate.getTime() + plant.interval * 86400000);
  nextDueDate.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((nextDueDate - today) / 86400000);
  let statusLabel = '';
  let statusType = 'ok';

  if (diffDays > 0) {
    statusLabel = `Za ${diffDays} ${diffDays === 1 ? 'dzień' : 'dni'}`;
    statusType = 'ok';
  } else if (diffDays === 0) {
    statusLabel = 'Podlej dziś';
    statusType = 'due';
  } else {
    const overdueDays = Math.abs(diffDays);
    statusLabel = `Spóźnione o ${overdueDays} ${overdueDays === 1 ? 'dzień' : 'dni'}`;
    statusType = 'late';
  }

  const getDynamicEmoji = () => {
    const overdue = -diffDays;
    if (overdue > 10) return '💀';
    if (overdue > 5) return '🥀';
    return plant.emoji || '🌿';
  };

  const handleWater = () => {
    waterPlant(plant.id);
    setFeedback('💧 Podlano roślinę!');
    setTimeout(() => setFeedback(''), 2000);
  };

  return (
    <DetailContainer
      status={statusType}
      key={plant.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      <EmojiDisplay>{getDynamicEmoji()}</EmojiDisplay>
      <DaysCounter>💧 co {plant.interval} dni</DaysCounter>
      <StatusText status={statusType}>{statusLabel}</StatusText>

      <WaterButton
        onClick={handleWater}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Podlane dziś
      </WaterButton>

      {plant.comment && <InfoRow>📝 {plant.comment}</InfoRow>}
      {plant.light && lightDescriptions[plant.light] && (
        <InfoRow>{lightDescriptions[plant.light]}</InfoRow>
      )}

      <AnimatePresence>
        {feedback && (
          <FeedbackMessage
            key="feedback"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {feedback}
          </FeedbackMessage>
        )}
      </AnimatePresence>
    </DetailContainer>
  );
};
