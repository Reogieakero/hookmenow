import { useState, useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export const LEVEL_CONFIGS = {
  1: { sharkCount: 2, totalPool: 10, requiredCatch: 5, description: "Calm waters. Exactly 2 sharks are hiding. Catch 5 fish to proceed." },
  2: { sharkWeight: 3, fishWeight: 7, requiredCatch: 6, description: "Choppy seas. Sharks are getting curious. Catch 6 fish." },
  3: { sharkWeight: 5, fishWeight: 5, requiredCatch: 3, description: "DANGER ZONE! 5 Sharks in the water. Catch 3 fish to survive." },
};

const SHARK_TRIVIA = [
  "Whale Sharks are the largest fish in the world, reaching up to 40 feet in length.",
  "Sharks do not have bones; their skeletons are made of pure cartilage.",
  "A Great White Shark can go through 20,000 teeth in its lifetime.",
  "Hammerhead Sharks have 360-degree vision thanks to their unique head shape.",
  "Some sharks, like the Mako, can swim at speeds over 40 mph."
];

const WIN_TRIVIA = [
  "Sharks have been on Earth longer than trees!",
  "A shark's sense of smell is so good it can detect one drop of blood in an Olympic pool.",
  "Some sharks can lose up to 100 teeth a day."
];

export function useGameLogic(onBack) {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [catchCount, setCatchCount] = useState(0);
  const [availableNumbers, setAvailableNumbers] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const [levelOneMap, setLevelOneMap] = useState({});
  const [selectedSet, setSelectedSet] = useState([]);
  const [isManualMode, setIsManualMode] = useState(false);
  const [gameState, setGameState] = useState('IDLE');
  const [multiOutcomes, setMultiOutcomes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('LOSE');
  const [currentTrivia, setCurrentTrivia] = useState("");
  const [showMechanics, setShowMechanics] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (currentLevel === 1) {
      const pool = new Array(10).fill(false);
      let sharksPlaced = 0;
      while (sharksPlaced < 2) {
        let randIdx = Math.floor(Math.random() * 10);
        if (!pool[randIdx]) {
          pool[randIdx] = true;
          sharksPlaced++;
        }
      }
      const mapping = {};
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach((num, index) => {
        mapping[num] = pool[index];
      });
      setLevelOneMap(mapping);
    }
  }, [currentLevel]);

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 15, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -15, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 40, useNativeDriver: true }),
    ]).start();
  };

  const toggleNumber = (num) => {
    if (gameState !== 'IDLE') return;
    if (selectedSet.includes(num)) {
      setSelectedSet(prev => prev.filter(n => n !== num));
    } else if (selectedSet.length < LEVEL_CONFIGS[currentLevel].requiredCatch) {
      setSelectedSet(prev => [...prev, num]);
    }
  };

  const handleManualSelection = (num) => {
    if (gameState !== 'IDLE') return;
    processBatch([num]);
  };

  const handleHookNow = () => {
    if (selectedSet.length < LEVEL_CONFIGS[currentLevel].requiredCatch) return;
    processBatch(selectedSet);
  };

  const processBatch = (pickedNumbers) => {
    setGameState('CASTING');
    const config = LEVEL_CONFIGS[currentLevel];
    
    const results = pickedNumbers.map(num => {
      let isShark = false;
      if (currentLevel === 1) {
        isShark = levelOneMap[num];
      } else {
        isShark = (Math.floor(Math.random() * 10) + 1) <= config.sharkWeight;
      }
      return { num, isShark };
    });

    setMultiOutcomes(results);

    setTimeout(() => {
      setGameState('RESULT');
      fadeAnim.setValue(1);
      const hasShark = results.some(r => r.isShark);

      if (hasShark) {
        setModalType('LOSE');
        triggerShake();
        setCurrentTrivia(SHARK_TRIVIA[Math.floor(Math.random() * SHARK_TRIVIA.length)]);
        setTimeout(() => setShowModal(true), 3000);
      } else {
        setTimeout(() => {
          if (isManualMode || catchCount + 1 >= config.requiredCatch) {
            setModalType('WIN');
            setCurrentTrivia(WIN_TRIVIA[Math.floor(Math.random() * WIN_TRIVIA.length)]);
            setShowModal(true);
          } else {
            setCatchCount(prev => prev + 1);
            setAvailableNumbers(prev => prev.filter(n => !pickedNumbers.includes(n)));
            setGameState('IDLE');
            setMultiOutcomes([]);
          }
        }, 2000);
      }
    }, 2000);
  };

  const proceed = () => {
    setShowModal(false);
    setSelectedSet([]);
    setMultiOutcomes([]);
    setCatchCount(0);
    setAvailableNumbers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    if (modalType === 'WIN' && currentLevel < 3) setCurrentLevel(prev => prev + 1);
    else if (modalType === 'LOSE') setCurrentLevel(1);
    else onBack();
    setGameState('IDLE');
  };

  return {
    currentLevel, catchCount, availableNumbers, selectedSet, isManualMode, setIsManualMode,
    gameState, multiOutcomes, showModal, modalType, currentTrivia, shakeAnim, fadeAnim,
    showMechanics, setShowMechanics, currentMechanics: LEVEL_CONFIGS[currentLevel].description,
    handleManualSelection, handleHookNow, toggleNumber, proceed
  };
}