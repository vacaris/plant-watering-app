import { useState, useEffect } from "react";

const STORAGE_KEY = "myplants";

const usePlants = () => {
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setPlants(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plants));
  }, [plants]);

  const addPlant = (plant) => {
    const newPlant = { ...plant, id: Date.now() };
    setPlants((prev) => [...prev, newPlant]);
  };

  const deletePlant = (id) => {
    setPlants((prev) => prev.filter((p) => p.id !== id));
  };

  return {
    plants,
    addPlant,
    deletePlant
  };
};

export default usePlants; // ✅ domyślny eksport
