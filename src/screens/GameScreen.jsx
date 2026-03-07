import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import LevelSelector from '../components/LevelSelector';
import ConfettiEffect from '../components/ConfettiEffect';

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

const LEVEL_CONFIGS = {
  1: { sharkWeight: 2, fishWeight: 8, requiredCatch: 5 },
  2: { sharkWeight: 3, fishWeight: 7, requiredCatch: 6 },
  3: { sharkWeight: 6, fishWeight: 4, requiredCatch: 3 },
};

export default function GameScreen({ onBack }) {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [catchCount, setCatchCount] = useState(0);
  const [availableNumbers, setAvailableNumbers] = useState(Array.from({ length: 10 }, (_, i) => i + 1));
  const [selectedNum, setSelectedNum] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [gameState, setGameState] = useState('IDLE');
  const [outcome, setOutcome] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('LOSE');
  const [currentTrivia, setCurrentTrivia] = useState("");
  
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (selectedNum && !isSpinning) {
      triggerGameLogic();
    }
  }, [selectedNum, isSpinning]);

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 15, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -15, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 15, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 40, useNativeDriver: true }),
    ]).start();
  };

  const triggerGameLogic = () => {
    setGameState('CASTING');
    const config = LEVEL_CONFIGS[currentLevel];
    
    setTimeout(() => {
      const randomValue = Math.floor(Math.random() * 10) + 1;
      const isShark = randomValue <= config.sharkWeight;
      setOutcome(isShark ? 'SHARK' : 'FISH');
      setGameState('RESULT');

      if (isShark) {
        setModalType('LOSE');
        triggerShake();
        setCurrentTrivia(SHARK_TRIVIA[Math.floor(Math.random() * SHARK_TRIVIA.length)]);
        setTimeout(() => setShowModal(true), 1500);
      } else {
        setTimeout(() => handleSuccess(selectedNum), 2000);
      }
    }, 2000);
  };

  const handleSuccess = (num) => {
    const nextCatchCount = catchCount + 1;
    const config = LEVEL_CONFIGS[currentLevel];
    setAvailableNumbers(prev => prev.filter(n => n !== num));
    
    if (nextCatchCount >= config.requiredCatch) {
      setModalType('WIN');
      setCurrentTrivia(WIN_TRIVIA[Math.floor(Math.random() * WIN_TRIVIA.length)]);
      setShowModal(true);
    } else {
      setCatchCount(nextCatchCount);
      resetTurn();
    }
  };

  const resetTurn = () => {
    setGameState('IDLE');
    setOutcome(null);
    setSelectedNum(null);
  };

  const proceed = () => {
    setShowModal(false);
    if (modalType === 'LOSE') {
      setCurrentLevel(1);
      setCatchCount(0);
      setAvailableNumbers(Array.from({ length: 10 }, (_, i) => i + 1));
    } else {
      if (currentLevel < 3) {
        setCurrentLevel(prev => prev + 1);
        setCatchCount(0);
        setAvailableNumbers(Array.from({ length: 10 }, (_, i) => i + 1));
      } else {
        onBack();
        return;
      }
    }
    resetTurn();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#71717a" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>STAGE_0{currentLevel}</Text>
          <Text style={styles.subTitle}>PROGRESS: {catchCount}/{LEVEL_CONFIGS[currentLevel].requiredCatch}</Text>
        </View>
      </View>

      <View style={styles.gameArea}>
        <View style={styles.topSelectorWrapper}>
          <LevelSelector 
            levels={availableNumbers}
            onSelectionComplete={setSelectedNum} 
            onSpinStateChange={setIsSpinning}
            disabled={gameState !== 'IDLE'}
          />
        </View>

        <LottieView
          source={require('../../assets/gifs/sea waves.json')}
          autoPlay={gameState !== 'RESULT'}
          loop={gameState !== 'RESULT'}
          style={styles.waveBackground}
        />

        <Animated.View style={[styles.visualizationContainer, { transform: [{ translateX: shakeAnim }] }]}>
          <View style={styles.visualArea}>
            <LottieView
              source={require('../../assets/gifs/humanfishing.json')}
              autoPlay
              loop={gameState !== 'RESULT'}
              style={styles.mainChar}
            />

            {gameState === 'RESULT' && (
              <View style={styles.outcomeOverlay}>
                <LottieView
                  source={outcome === 'SHARK' 
                    ? require('../../assets/gifs/shark.json') 
                    : require('../../assets/gifs/smallfish.json')
                  }
                  autoPlay
                  loop={outcome === 'FISH'}
                  style={styles.outcomeAnim}
                />
              </View>
            )}
          </View>
        </Animated.View>
      </View>

      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          {modalType === 'WIN' && <ConfettiEffect />}
          <View style={[styles.modalContent, modalType === 'WIN' && styles.winBorder]}>
            <Text style={[styles.modalTitle, modalType === 'WIN' && styles.winTitleText]}>
              {modalType === 'WIN' ? `STAGE ${currentLevel} COMPLETE` : "GAME OVER"}
            </Text>
            <View style={styles.triviaBox}>
              <Text style={styles.triviaLabel}>DID YOU KNOW?</Text>
              <Text style={styles.triviaText}>{currentTrivia}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.actionBtn, modalType === 'WIN' && styles.winBtn]} 
              onPress={proceed}
            >
              <Text style={[styles.btnText, modalType === 'WIN' && styles.winBtnText]}>
                {modalType === 'WIN' 
                  ? (currentLevel < 3 ? "NEXT LEVEL" : "FINISH MISSION") 
                  : "RESTART MISSION"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#001524' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 28, paddingTop: 20, paddingBottom: 20, zIndex: 10 },
  backButton: { padding: 4 },
  headerTitle: { color: '#fafafa', fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  subTitle: { color: '#71717a', fontSize: 9, fontWeight: '600', letterSpacing: 1 },
  gameArea: { flex: 1, position: 'relative' },
  topSelectorWrapper: { paddingTop: 10, zIndex: 10 },
  visualizationContainer: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 50 },
  visualArea: { width: '100%', alignItems: 'center', position: 'relative' },
  waveBackground: { position: 'absolute', width: '100%', height: 300, opacity: 0.8, bottom: 0, zIndex: 1 },
  mainChar: { width: 400, height: 400, zIndex: 2 },
  outcomeOverlay: { position: 'absolute', bottom: 50, width: 320, height: 320, zIndex: 3 },
  outcomeAnim: { width: '100%', height: '100%' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 21, 36, 0.98)', justifyContent: 'center', alignItems: 'center', padding: 30 },
  modalContent: { width: '100%', backgroundColor: '#022c43', padding: 30, borderLeftWidth: 4, borderColor: '#ef4444' },
  winBorder: { borderColor: '#FFECD1' },
  modalTitle: { color: '#ef4444', fontSize: 24, fontWeight: '900', letterSpacing: 2, marginBottom: 20 },
  winTitleText: { color: '#FFECD1' },
  triviaBox: { marginBottom: 30 },
  triviaLabel: { color: '#71717a', fontSize: 10, fontWeight: '800', marginBottom: 8 },
  triviaText: { color: '#fafafa', fontSize: 16, lineHeight: 24 },
  actionBtn: { backgroundColor: '#ef4444', paddingVertical: 15, alignItems: 'center' },
  winBtn: { backgroundColor: '#FFECD1' },
  btnText: { color: '#fafafa', fontWeight: '900', fontSize: 12, letterSpacing: 1 },
  winBtnText: { color: '#001524' }
});