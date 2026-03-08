import { useState, useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export const LEVEL_CONFIGS = {
  1: { sharkWeight: 2, fishWeight: 8, requiredCatch: 5, description: "Calm waters. Sharks are rare. Catch 5 fish to proceed." },
  2: { sharkWeight: 3, fishWeight: 7, requiredCatch: 6, description: "Choppy seas. Sharks are getting curious. Catch 6 fish." },
  3: { sharkWeight: 6, fishWeight: 4, requiredCatch: 3, description: "DANGER ZONE! Shark infested waters. Catch 3 fish to survive." },
};

const SHARK_TRIVIA = [
  "Whale Sharks are the largest fish in the world, reaching up to 40 feet in length.",
  "Sharks do not have bones; their skeletons are made of pure cartilage.",
  "A Great White Shark can go through 20,000 teeth in its lifetime.",
  "Hammerhead Sharks have 360-degree vision thanks to their unique head shape.",
  "Some sharks, like the Mako, can swim at speeds over 40 mph.",
  "Sharks have been around for over 400 million years—older than dinosaurs.",
  "A shark's skin feels like sandpaper because it is covered in tiny scales.",
  "Greenland Sharks can live for up to 400 years.",
  "Sharks have a 'sixth sense' called electroreception to detect heartbeats.",
  "Most sharks must keep swimming to stay alive so water flows over their gills."
];

const WIN_TRIVIA = [
  "Ancient Greeks used shark skin to polish wood.",
  "Some sharks can lose up to 100 teeth a day.",
  "The Megalodon was a prehistoric shark that grew up to 60 feet long.",
  "Sharks have been on Earth longer than trees!",
  "A shark's sense of smell is so good it can detect one drop of blood in an Olympic pool."
];

export function useGameLogic(onBack) {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [catchCount, setCatchCount] = useState(0);
  const [availableNumbers, setAvailableNumbers] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const [gameState, setGameState] = useState('IDLE');
  const [outcome, setOutcome] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('LOSE');
  const [currentTrivia, setCurrentTrivia] = useState("");
  const [showMechanics, setShowMechanics] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setAvailableNumbers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  }, []);

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 15, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -15, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 15, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 40, useNativeDriver: true }),
    ]).start();
  };

  const handleManualSelection = (num) => {
    if (gameState !== 'IDLE' || num === undefined || num === null) return;
    
    setGameState('CASTING');
    
    const config = LEVEL_CONFIGS[currentLevel];
    
    setTimeout(() => {
      const randomValue = Math.floor(Math.random() * 10) + 1;
      const isShark = randomValue <= config.sharkWeight;
      
      setOutcome(isShark ? 'SHARK' : 'FISH');
      setGameState('RESULT');
      
      fadeAnim.setValue(1);
      Animated.timing(fadeAnim, { toValue: 0, duration: 2000, useNativeDriver: true }).start();

      if (isShark) {
        setModalType('LOSE');
        triggerShake();
        setCurrentTrivia(SHARK_TRIVIA[Math.floor(Math.random() * SHARK_TRIVIA.length)]);
        setAvailableNumbers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        setTimeout(() => setShowModal(true), 2500);
      } else {
        setAvailableNumbers(prev => prev.filter(n => n !== num));
        setTimeout(() => {
          const nextCatchCount = catchCount + 1;
          if (nextCatchCount >= config.requiredCatch) {
            setModalType('WIN');
            setCurrentTrivia(WIN_TRIVIA[Math.floor(Math.random() * WIN_TRIVIA.length)]);
            setShowModal(true);
          } else {
            setCatchCount(nextCatchCount);
            setGameState('IDLE');
            setOutcome(null);
            if (availableNumbers.length <= 1) {
              setAvailableNumbers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
            }
          }
        }, 2000);
      }
    }, 2000);
  };

  const proceed = () => {
    setShowModal(false);
    const resetNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    if (modalType === 'LOSE') {
      setCurrentLevel(1);
      setCatchCount(0);
      setAvailableNumbers(resetNumbers);
    } else if (currentLevel < 3) {
      setCurrentLevel(prev => prev + 1);
      setCatchCount(0);
      setAvailableNumbers(resetNumbers);
    } else {
      onBack();
      return;
    }
    setGameState('IDLE');
    setOutcome(null);
  };

  return {
    currentLevel, catchCount, availableNumbers, gameState, outcome,
    showModal, modalType, currentTrivia, shakeAnim, fadeAnim,
    showMechanics, setShowMechanics, currentMechanics: LEVEL_CONFIGS[currentLevel].description,
    handleManualSelection, proceed
  };
}