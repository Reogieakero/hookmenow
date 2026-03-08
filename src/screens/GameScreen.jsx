import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Animated, Pressable, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import LevelSelector from '../components/LevelSelector';
import ConfettiEffect from '../components/ConfettiEffect';
import MechanicsModal from '../components/MechanicsModal';
import CatchDialogue from '../components/CatchDialogue';
import GameHeader from '../components/GameHeader';
import FloatingTriviaButton from '../components/FloatingTriviaButton';
import { useGameLogic, LEVEL_CONFIGS } from '../hooks/useGameLogic';

const { width } = Dimensions.get('window');

const TRIVIA_LIST = ["Sharks have been around for more than 400 million years.", "The whale shark is the largest fish in the world.", "A shark's skin feels similar to sandpaper.", "Most sharks have to keep swimming to stay alive.", "Sharks do not have bones; they have cartilage.", "Some sharks can live for over 400 years.", "A shark can smell a drop of blood from miles away.", "Hammerhead sharks have 360-degree vision.", "Great white sharks can jump 10 feet out of the water.", "Sharks can have up to 30,000 teeth in their lifetime.", "The smallest shark is the dwarf lanternshark, only 8 inches long.", "Sharks play a vital role in the ocean ecosystem.", "Mako sharks are the fastest sharks, reaching 46 mph.", "Not all sharks live in salt water; some live in rivers.", "Sharks have a 'sixth sense' that detects electricity.", "A shark's liver is full of oil to help it float.", "Blue sharks are known for their beautiful blue color.", "Megalodon was an ancient shark three times bigger than a Great White.", "Sharks do not have vocal cords; they are silent hunters.", "Most sharks are cold-blooded, but a few are warm-blooded."];
const CATCH_PHRASES = ["PALDOO!", "HULI!", "LAKING ISDA!", "KUHA!", "PANALO!", "TIMES TEN!", "SCORE!", "NAKAW!", "HULI KA!", "BINGO!", "SULBAD ANG UTANG"];
const SHARK_PHRASES = ["OH NO!", "SHARK!", "TAKBO!", "LAGOT!", "DELIKADO!", "SUGAT!", "AGUY!", "WAG NYO KAININ!", "YUK!", "MALAS!"];

export default function GameScreen({ onBack, isMusicPlaying, onToggleMusic }) {
  const selectorRef = useRef();
  const [activePhrase, setActivePhrase] = useState("");
  const [randomTriviaVisible, setRandomTriviaVisible] = useState(false);
  const [selectedTrivia, setSelectedTrivia] = useState("");
  const [floatingValue, setFloatingValue] = useState(null);
  const floatAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const {
    currentLevel, catchCount, availableNumbers, selectedSet, isManualMode, setIsManualMode,
    gameState, multiOutcomes, showModal, modalType, currentTrivia, shakeAnim, fadeAnim,
    showMechanics, setShowMechanics, currentMechanics,
    handleManualSelection, handleHookNow, toggleNumber, proceed
  } = useGameLogic(onBack);

  const required = LEVEL_CONFIGS[currentLevel].requiredCatch;

  useEffect(() => {
    if (gameState === 'RESULT' && multiOutcomes.length === 1) {
      const isShark = multiOutcomes[0]?.isShark;
      const list = isShark ? SHARK_PHRASES : CATCH_PHRASES;
      setActivePhrase(list[Math.floor(Math.random() * list.length)]);
    } else if (gameState !== 'RESULT') {
      setActivePhrase("");
    }
  }, [gameState, multiOutcomes]);

  const triggerFeedback = (num) => {
    setFloatingValue(num);
    floatAnim.setValue(0);
    opacityAnim.setValue(1);
    Animated.parallel([
      Animated.timing(floatAnim, { toValue: -120, duration: 1000, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
    ]).start(() => setFloatingValue(null));
  };

  const showTrivia = () => {
    setSelectedTrivia(TRIVIA_LIST[Math.floor(Math.random() * TRIVIA_LIST.length)]);
    setRandomTriviaVisible(true);
  };

  const getBg = () => {
    if (currentLevel === 2) return { backgroundColor: '#fb923c' };
    if (currentLevel === 3) return { backgroundColor: '#450a0a' };
    return { backgroundColor: '#001524' };
  };

  return (
    <View style={[styles.container, getBg()]}>
      {currentLevel === 2 && <View style={styles.sun} />}

      <GameHeader 
        onBack={onBack} currentLevel={currentLevel} isManualMode={isManualMode} 
        setIsManualMode={setIsManualMode} catchCount={catchCount} required={required} 
        selectedCount={selectedSet.length} isMusicPlaying={isMusicPlaying} 
        onPiliemonPress={onToggleMusic} onShowMechanics={() => setShowMechanics(true)} 
      />

      <Pressable style={styles.gameArea} onPress={() => !isManualMode && gameState === 'IDLE' && selectorRef.current?.handleStop()}>
        <FloatingTriviaButton onPress={showTrivia} currentLevel={currentLevel} />

        {floatingValue && (
          <Animated.View style={[styles.floatingIndicator, { opacity: opacityAnim, transform: [{ translateY: floatAnim }], borderColor: currentLevel === 2 ? '#fff' : '#4ade80' }]}>
            <Text style={[styles.floatingText, currentLevel === 2 && { color: '#fff' }]}>{floatingValue}</Text>
          </Animated.View>
        )}

        <View style={styles.topSelectorWrapper}>
          {gameState === 'IDLE' && (
            isManualMode ? (
              <View style={styles.manualArea}>
                <View style={styles.grid}>
                  {availableNumbers.map(num => (
                    <TouchableOpacity key={num} onPress={() => { if (!selectedSet.includes(num)) triggerFeedback(num); toggleNumber(num); }} style={[styles.numBtn, selectedSet.includes(num) && styles.activeNumBtn, currentLevel === 2 && { borderColor: 'rgba(255,255,255,0.3)' }]}>
                      <Text style={[styles.numText, selectedSet.includes(num) && styles.activeNumText]}>{num}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {selectedSet.length === required && (
                  <TouchableOpacity style={styles.hookBtn} onPress={handleHookNow}><Text style={styles.hookBtnText}>CAST ALL LINES</Text></TouchableOpacity>
                )}
              </View>
            ) : (
              <LevelSelector ref={selectorRef} levels={availableNumbers} onSelectionTriggered={(n) => { triggerFeedback(n); handleManualSelection(n); }} disabled={gameState !== 'IDLE'} />
            )
          )}
        </View>

        <LottieView source={require('../../assets/gifs/Dolphin Jumping.json')} autoPlay loop style={styles.dolphin} />
        <LottieView source={require('../../assets/gifs/sea waves.json')} autoPlay loop style={[styles.waves, currentLevel === 2 && { tintColor: '#fdba74', opacity: 0.5 }]} />

        <Animated.View style={[styles.visualContainer, { transform: [{ translateX: shakeAnim }] }]}>
          <View style={styles.visualArea}>
            {activePhrase !== "" && <CatchDialogue text={activePhrase} />}

            {gameState === 'RESULT' && (
              <Animated.View style={[styles.catchResultContainer, { opacity: fadeAnim }]}>
                {multiOutcomes.map((o, i) => (
                  <LottieView 
                    key={i} 
                    source={o.isShark ? require('../../assets/gifs/shark.json') : require('../../assets/gifs/smallfish.json')} 
                    autoPlay 
                    loop={false} 
                    style={styles.catchAnim} 
                  />
                ))}
              </Animated.View>
            )}

            {gameState === 'IDLE' || multiOutcomes.length <= 1 ? (
              <LottieView source={require('../../assets/gifs/humanfishing.json')} autoPlay loop={gameState !== 'RESULT'} style={styles.mainChar} />
            ) : (
              <View style={styles.multiFisherRow}>
                {multiOutcomes.map((item, index) => (
                  <View key={index} style={[styles.fisherColumn, { width: currentLevel === 3 ? (width / 3.5) : (width / 3.2) }]}>
                    <Text style={[styles.fisherLabel, currentLevel === 2 && { color: '#fff' }]}>#{item.num}</Text>
                    <LottieView source={require('../../assets/gifs/humanfishing.json')} autoPlay loop style={styles.largeFisher} />
                  </View>
                ))}
              </View>
            )}
          </View>
        </Animated.View>
      </Pressable>

      <Modal visible={randomTriviaVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { borderColor: '#4ade80', borderLeftWidth: 4 }]}>
            <Text style={[styles.modalTitle, { color: '#4ade80' }]}>SHARK FACT</Text>
            <Text style={styles.triviaText}>{selectedTrivia}</Text>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#4ade80', marginTop: 20 }]} onPress={() => setRandomTriviaVisible(false)}><Text style={styles.btnText}>GOT IT!</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      <MechanicsModal visible={showMechanics} onClose={() => setShowMechanics(false)} stage={currentLevel} description={currentMechanics} />

      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          {modalType === 'WIN' && <ConfettiEffect />}
          <View style={[styles.modalContent, modalType === 'WIN' && styles.winBorder]}>
            <Text style={[styles.modalTitle, modalType === 'WIN' && styles.winTitleText]}>{modalType === 'WIN' ? `STAGE ${currentLevel} COMPLETE` : "GAME OVER"}</Text>
            <Text style={styles.triviaLabel}>DID YOU KNOW?</Text>
            <Text style={styles.triviaText}>{currentTrivia}</Text>
            <TouchableOpacity style={[styles.actionBtn, modalType === 'WIN' && styles.winBtn, { marginTop: 20 }]} onPress={proceed}>
              <Text style={[styles.btnText, modalType === 'WIN' && styles.winBtnText]}>{modalType === 'WIN' ? (currentLevel < 3 ? "NEXT LEVEL" : "FINISH MISSION") : "RESTART MISSION"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  sun: { position: 'absolute', top: 120, right: 40, width: 80, height: 80, borderRadius: 40, backgroundColor: '#fed7aa', opacity: 0.8, elevation: 10 },
  gameArea: { flex: 1, position: 'relative' },
  floatingIndicator: { position: 'absolute', top: '45%', left: width / 2 - 30, width: 60, height: 60, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 30, borderWidth: 2, justifyContent: 'center', alignItems: 'center', zIndex: 99 },
  floatingText: { color: '#4ade80', fontSize: 28, fontWeight: '900' },
  topSelectorWrapper: { paddingTop: 10, zIndex: 10, height: 180 },
  manualArea: { alignItems: 'center', width: '100%' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  numBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#1e293b', margin: 4, justifyContent: 'center', alignItems: 'center' },
  activeNumBtn: { backgroundColor: '#4ade80', borderColor: '#4ade80' },
  numText: { color: '#71717a', fontWeight: 'bold' },
  activeNumText: { color: '#001524' },
  hookBtn: { backgroundColor: '#4ade80', marginTop: 10, paddingHorizontal: 20, paddingVertical: 6, borderRadius: 4 },
  hookBtnText: { color: '#001524', fontWeight: '900', fontSize: 11 },
  waves: { position: 'absolute', width: '100%', height: 300, bottom: -10, zIndex: 1 },
  dolphin: { position: 'absolute', width: width * 0.5, height: 150, bottom: 50, right: 100, zIndex: 0, opacity: 0.6 },
  visualContainer: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 60 },
  visualArea: { width: '100%', alignItems: 'center', position: 'relative', minHeight: 350 },
  catchResultContainer: { position: 'absolute', top: -100, flexDirection: 'row', justifyContent: 'center', width: '100%', zIndex: 20 },
  catchAnim: { width: 400, height: 700 },
  mainChar: { width: 600, height: 600, zIndex: 2, marginBottom: -60 },
  multiFisherRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', width: '100%', zIndex: 2, paddingHorizontal: 10 },
  fisherColumn: { alignItems: 'center', marginVertical: 5 },
  fisherLabel: { color: '#4ade80', fontSize: 10, fontWeight: 'bold', marginBottom: -10 },
  largeFisher: { width: 180, height: 180 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 21, 36, 0.98)', justifyContent: 'center', alignItems: 'center', padding: 30 },
  modalContent: { width: '100%', backgroundColor: '#022c43', padding: 30, borderLeftWidth: 4, borderColor: '#ef4444' },
  winBorder: { borderColor: '#FFECD1' },
  modalTitle: { color: '#ef4444', fontSize: 24, fontWeight: '900', marginBottom: 20 },
  winTitleText: { color: '#FFECD1' },
  triviaLabel: { color: '#71717a', fontSize: 10, fontWeight: '800', marginBottom: 8 },
  triviaText: { color: '#fafafa', fontSize: 16, lineHeight: 24 },
  actionBtn: { backgroundColor: '#ef4444', paddingVertical: 15, alignItems: 'center' },
  winBtn: { backgroundColor: '#FFECD1' },
  btnText: { color: '#fafafa', fontWeight: '900', fontSize: 12 },
  winBtnText: { color: '#001524' }
});