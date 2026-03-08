import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useScore = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [ownedItems, setOwnedItems] = useState([]);
  const [activeBackground, setActiveBackground] = useState('default');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const savedHS = await AsyncStorage.getItem('highScore');
      const savedCoins = await AsyncStorage.getItem('totalCoins');
      const savedOwned = await AsyncStorage.getItem('ownedItems');
      const savedActiveBg = await AsyncStorage.getItem('activeBackground');

      if (savedHS !== null) setHighScore(parseInt(savedHS));
      if (savedCoins !== null) setCoins(parseInt(savedCoins));
      if (savedOwned !== null) setOwnedItems(JSON.parse(savedOwned));
      if (savedActiveBg !== null) setActiveBackground(savedActiveBg);
    } catch (e) {
      console.error(e);
    }
  };

  const purchaseItem = useCallback(async (itemId, price) => {
    if (coins >= price) {
      try {
        const newTotal = coins - price;
        const newOwned = [...ownedItems, itemId];
        
        await AsyncStorage.setItem('totalCoins', newTotal.toString());
        await AsyncStorage.setItem('ownedItems', JSON.stringify(newOwned));
        
        setCoins(newTotal);
        setOwnedItems(newOwned);
        return true;
      } catch (e) {
        console.error(e);
        return false;
      }
    }
    return false;
  }, [coins, ownedItems]);

  const updateActiveBackground = useCallback(async (bgId) => {
    try {
      await AsyncStorage.setItem('activeBackground', bgId);
      setActiveBackground(bgId);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const convertScoreToCoins = useCallback(async (finalScore) => {
    const earnedCoins = Math.floor(finalScore / 2);
    if (earnedCoins > 0) {
      try {
        const newTotal = coins + earnedCoins;
        await AsyncStorage.setItem('totalCoins', newTotal.toString());
        setCoins(newTotal);
        return earnedCoins;
      } catch (e) {
        console.error(e);
      }
    }
    return 0;
  }, [coins]);

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

  return { 
    score, 
    highScore, 
    coins, 
    ownedItems,
    activeBackground,
    handleCatchPoints, 
    resetScore, 
    saveHighScore, 
    convertScoreToCoins,
    purchaseItem,
    setActiveBackground: updateActiveBackground
  };
};