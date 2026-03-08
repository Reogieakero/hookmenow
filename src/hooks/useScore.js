import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useScore = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    loadHighScore();
  }, []);

  const loadHighScore = async () => {
    try {
      const saved = await AsyncStorage.getItem('highScore');
      if (saved !== null) setHighScore(parseInt(saved));
    } catch (e) {
      console.error(e);
    }
  };

  const saveHighScore = useCallback(async (finalScore) => {
    if (finalScore > highScore) {
      try {
        await AsyncStorage.setItem('highScore', finalScore.toString());
        setHighScore(finalScore);
      } catch (e) {
        console.error(e);
      }
    }
  }, [highScore]);

  const handleCatchPoints = useCallback((outcomes) => {
    let totalChange = 0;
    let hitShark = false;

    outcomes.forEach(outcome => {
      if (outcome.isShark) hitShark = true;
      else totalChange += 100;
    });

    setScore(prev => {
      if (hitShark) {
        saveHighScore(prev);
        return 0;
      }
      return prev + totalChange;
    });
  }, [saveHighScore]);

  const resetScore = useCallback(() => setScore(0), []);

  return { score, highScore, handleCatchPoints, resetScore, saveHighScore };
};