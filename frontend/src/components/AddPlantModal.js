import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { usePlantContext } from '../context/PlantContext';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 1.5rem;
  width: 320px;
  max-width: 95%;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
`;

const FieldLabel = styled.label`
  display: block;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const TextInput = styled.input`
  width: 100%;
  padding: 0.4rem;
  margin-top: 0.25rem;
  margin-bottom: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
`;

const EmojiPicker = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.5rem 0 1rem;
`;

const EmojiOption = styled.button`
  font-size: 1.4rem;
  padding: 0.2rem 0.4rem;
  border-radius: 6px;
  background: transparent;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  &.selected {
    border-color: #4caf50;
    background: #e8f5e9;
  }
`;

const LightOptions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const LightOption = styled.button`
  background: none;
  border: 2px solid transparent;
  border-radius: 8px;
  padding: 0.4rem;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;

  &.selected {
    border-color: #4caf50;
    background: #e8f5e9;
  }

  span {
    font-size: 0.7rem;
    margin-top: 0.2rem;
    color: #333;
  }
`;

const SubmitButton = styled(motion.button)`
  padding: 0.5rem 1rem;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;
  &:hover { background: #43a047; }
`;

const CancelButton = styled(motion.button)`
  padding: 0.5rem 1rem;
  background: #bbb;
  color: #000;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover { background: #aaa; }
`;

export const AddPlantModal = ({ onClose }) => {
  const { addPlant, selectPlant } = usePlantContext();

  const [emoji, setEmoji] = useState('🌿');
  const [light, setLight] = useState('');
  const emojiChoices = ['🌿', '🌱', '🌵', '🪴', '🍀', '🌳','🌷','🌾','🌼','🌹' ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name')?.toString().trim() || '';
    const interval = parseInt(formData.get('interval'), 10);
    const lastWatered = formData.get('lastWatered') || '';
    const comment = formData.get('comment')?.toString().trim() || '';

    if (!name || !emoji || !interval || !lastWatered) {
      alert("Proszę wypełnić wszystkie wymagane pola.");
      return;
    }

    const newId = addPlant({ name, emoji, interval, lastWatered, comment, light });
    selectPlant(newId);
    onClose();
  };

  return (
    <Overlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <ModalContent
        as={motion.div}
        initial={{ scale: 0.8, opacity: 0, y: -20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ fontSize: '1.2rem', marginTop: 0 }}>Dodaj roślinę</h2>
        <form onSubmit={handleSubmit}>
          <FieldLabel>
            Nazwa:
            <TextInput type="text" name="name" placeholder="np. Fikus" />
          </FieldLabel>

          <FieldLabel>Emoji:</FieldLabel>
          <EmojiPicker>
            {emojiChoices.map(em => (
              <EmojiOption
                key={em}
                className={emoji === em ? 'selected' : ''}
                onClick={() => setEmoji(em)}
                type="button"
              >
                {em}
              </EmojiOption>
            ))}
          </EmojiPicker>

          <FieldLabel>
            Interwał (dni):
            <TextInput type="number" name="interval" placeholder="np. 7" min="1" />
          </FieldLabel>

          <FieldLabel>
            Ostatnie podlanie:
            <TextInput type="date" name="lastWatered" defaultValue={new Date().toISOString().slice(0, 10)} />
          </FieldLabel>

          <FieldLabel>
            Komentarz (opcjonalny):
            <TextInput type="text" name="comment" placeholder="np. Lubi wilgotne powietrze" />
          </FieldLabel>

          <FieldLabel>Preferencje światła:</FieldLabel>
          <LightOptions>
            <LightOption
              className={light === 'sun' ? 'selected' : ''}
              onClick={() => setLight('sun')}
              type="button"
            >
              ☀️ <span>pełne słońce</span>
            </LightOption>
            <LightOption
              className={light === 'part' ? 'selected' : ''}
              onClick={() => setLight('part')}
              type="button"
            >
              ⛅ <span>półcień</span>
            </LightOption>
            <LightOption
              className={light === 'shade' ? 'selected' : ''}
              onClick={() => setLight('shade')}
              type="button"
            >
              🌑 <span>cień</span>
            </LightOption>
          </LightOptions>

          <div style={{ textAlign: 'right', marginTop: '1.5rem' }}>
            <SubmitButton type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Dodaj
            </SubmitButton>
            <CancelButton type="button" onClick={onClose} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Anuluj
            </CancelButton>
          </div>
        </form>
      </ModalContent>
    </Overlay>
  );
};
