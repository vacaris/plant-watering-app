import React, { createContext, useReducer, useEffect, useContext } from 'react';

const storedPlants = localStorage.getItem('plants');
const initialPlants = storedPlants ? JSON.parse(storedPlants) : [];
const initialState = {
  plants: initialPlants,
  selectedId: initialPlants.length > 0 ? initialPlants[0].id : null
};

const PlantContext = createContext(null);

const plantReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_PLANT': {
      const newPlant = action.payload;
      const newPlantsList = [...state.plants, newPlant];
      return {
        plants: newPlantsList,
        selectedId: newPlant.id
      };
    }
    case 'REMOVE_PLANT': {
      const idToRemove = action.payload;
      const newPlantsList = state.plants.filter(p => p.id !== idToRemove);
      let newSelectedId = state.selectedId;

      if (idToRemove === state.selectedId) {
        if (newPlantsList.length === 0) {
          newSelectedId = null;
        } else {
          const removedIndex = state.plants.findIndex(p => p.id === idToRemove);
          if (removedIndex >= newPlantsList.length) {
            newSelectedId = newPlantsList[newPlantsList.length - 1].id;
          } else {
            newSelectedId = newPlantsList[removedIndex].id;
          }
        }
      }

      return {
        plants: newPlantsList,
        selectedId: newSelectedId
      };
    }
    case 'WATER_PLANT': {
      const idToWater = action.payload;
      const today = new Date().toISOString().slice(0, 10);
      const newPlantsList = state.plants.map(p =>
        p.id === idToWater ? { ...p, lastWatered: today } : p
      );
      return {
        ...state,
        plants: newPlantsList
      };
    }
    case 'SELECT_PLANT': {
      return {
        ...state,
        selectedId: action.payload
      };
    }
    case 'SET_ALL_WATERED': {
      return {
        ...state,
        plants: action.payload
      };
    }
    default:
      return state;
  }
};

export const PlantProvider = ({ children }) => {
  const [state, dispatch] = useReducer(plantReducer, initialState);

  useEffect(() => {
    localStorage.setItem('plants', JSON.stringify(state.plants));
  }, [state.plants]);

  const addPlant = (plantData) => {
    const newPlant = { ...plantData, id: Date.now() };
    dispatch({ type: 'ADD_PLANT', payload: newPlant });
    return newPlant.id;
  };

  const removePlant = (id) => {
    dispatch({ type: 'REMOVE_PLANT', payload: id });
  };

  const waterPlant = (id) => {
    dispatch({ type: 'WATER_PLANT', payload: id });
  };

  const selectPlant = (id) => {
    dispatch({ type: 'SELECT_PLANT', payload: id });
  };

  const waterAllPlants = () => {
    const today = new Date().toISOString().slice(0, 10);
    const newPlantsList = state.plants.map(p => ({ ...p, lastWatered: today }));
    dispatch({ type: 'SET_ALL_WATERED', payload: newPlantsList });
  };

  return (
    <PlantContext.Provider value={{
      plants: state.plants,
      selectedId: state.selectedId,
      addPlant,
      removePlant,
      waterPlant,
      selectPlant,
      waterAllPlants
    }}>
      {children}
    </PlantContext.Provider>
  );
};

export const usePlantContext = () => useContext(PlantContext);
