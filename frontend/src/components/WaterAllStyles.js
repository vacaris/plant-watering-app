import styled from 'styled-components';

export const WaterAllWrapper = styled.div`
  margin-top: 1rem;
  text-align: center;
`;

export const WaterButton = styled.button`
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1rem;
  &:hover {
    background: #43a047;
  }
`;

export const SuccessMessage = styled.div`
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #4caf50;
  animation: fadein 0.3s ease;
`;
