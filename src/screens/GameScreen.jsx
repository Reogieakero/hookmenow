import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Animated, Pressable, Dimensions, PanResponder } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import LevelSelector from '../components/LevelSelector';
import ConfettiEffect from '../components/ConfettiEffect';
import MechanicsModal from '../components/MechanicsModal';
import CatchDialogue from '../components/CatchDialogue';
import { useGameLogic, LEVEL_CONFIGS } from '../hooks/useGameLogic';

const { width, height } = Dimensions.get('window');

const TRIVIA_LIST = [
  "Sharks have been around for more than 400 million years.",
  "The whale shark is the largest fish in the world.",
  "A shark's skin feels similar to sandpaper.",
  "Most sharks have to keep swimming to stay alive.",
  "Sharks do not have bones; they have cartilage.",
  "Some sharks can live for over 400 years.",
  "A shark can smell a drop of blood from miles away.",
  "Hammerhead sharks have 360-degree vision.",
  "Great white sharks can jump 10 feet out of the water.",
  "Sharks can have up to 30,000 teeth in their lifetime.",
  "The smallest shark is the dwarf lanternshark, only 8 inches long.",
  "Sharks play a vital role in the ocean ecosystem.",
  "Mako sharks are the fastest sharks, reaching 46 mph.",
  "Not all sharks live in salt water; some live in rivers.",
  "Sharks have a 'sixth sense' that detects electricity.",
  "A shark's liver is full of oil to help it float.",
  "Blue sharks are known for their beautiful blue color.",
  "Megalodon was an ancient shark three times bigger than a Great White.",
  "Sharks do not have vocal cords; they are silent hunters.",
  "Most sharks are cold-blooded, but a few are warm-blooded."
];

const CATCH_PHRASES = ["PALDOO!", "HULI!", "LAKING ISDA!", "KUHA!", "PANALO!", "TIMES TEN!", "SCORE!", "NAKAW!", "HULI KA!", "BINGO!", "SULBAD ANG UTANG"];
const SHARK_PHRASES = ["OH NO!", "SHARK!", "TAKBO!", "LAGOT!", "DELIKADO!", "SUGAT!", "AGUY!", "WAG NYO KAININ!", "YUK!", "MALAS!"];

export default function GameScreen({ onBack, isMusicPlaying, onToggleMusic }) {
  const selectorRef = useRef();
  const [audioAlertVisible, setAudioAlertVisible] = useState(false);
  const [activePhrase, setActivePhrase] = useState("");
  const [randomTriviaVisible, setRandomTriviaVisible] = useState(false);
  const [selectedTrivia, setSelectedTrivia] = useState("");
  const [floatingValue, setFloatingValue] = useState(null);
  const floatAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Initial position: Bottom Right
  const pan = useRef(new Animated.ValueXY({ x: width - 80, y: height - 150 })).current;

  const panResponder = useRef(
    PanResponder.create({
      // Only take control if the user moves more than 5 pixels (prevents blocking the tap)
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value
        });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    })
  ).current;

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
      const phraseList = isShark ? SHARK_PHRASES : CATCH_PHRASES;
      const randomText = phraseList[Math.floor(Math.random() * phraseList.length)];
      setActivePhrase(randomText);
    } else if (gameState !== 'RESULT') {
      setActivePhrase("");
    }
  }, [gameState, multiOutcomes]);

  const triggerSelectionFeedback = (num) => {
    setFloatingValue(num);
    floatAnim.setValue(0);
    opacityAnim.setValue(1);
    Animated.parallel([
      Animated.timing(floatAnim, { toValue: -120, duration: 1000, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
    ]).start(() => setFloatingValue(null));
  };

  const onToggleNumberWithEffect = (num) => {
    if (!selectedSet.includes(num)) triggerSelectionFeedback(num);
    toggleNumber(num);
  };

  const onAutoSelection = (num) => {
    triggerSelectionFeedback(num);
    handleManualSelection(num);
  };

  const handlePiliemonPress = () => {
    if (isMusicPlaying) setAudioAlertVisible(true);
    else onToggleMusic();
  };

  const showRandomTrivia = () => {
    const randomIndex = Math.floor(Math.random() * TRIVIA_LIST.length);
    setSelectedTrivia(TRIVIA_LIST[randomIndex]);
    setRandomTriviaVisible(true);
  };

  const getDynamicBackground = () => {
    if (currentLevel === 2) return { backgroundColor: '#fb923c' }; 
    if (currentLevel === 3) return { backgroundColor: '#450a0a' }; 
    return { backgroundColor: '#001524' }; 
  };

  return (
    <View style={[styles.container, getDynamicBackground()]}>
      {currentLevel === 2 && <View style={styles.sun} />}

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color={currentLevel === 2 ? "#fff" : "#71717a"} />
        </TouchableOpacity>
        
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={[styles.headerTitle, currentLevel === 2 && { color: '#fff' }]}>STAGE_0{currentLevel}</Text>
          <Text style={[styles.subTitle, currentLevel === 2 && { color: '#ffedd5' }]}>
            {isManualMode ? `SELECTED: ${selectedSet.length}/${required}` : `PROGRESS: ${catchCount}/${required}`}
          </Text>
        </View>

        <TouchableOpacity 
          onPress={handlePiliemonPress} 
          style={[styles.piliemonBtn, isMusicPlaying && styles.piliemonBtnActive, currentLevel === 2 && { borderColor: '#fff' }]}
        >
          <Ionicons 
            name={isMusicPlaying ? "musical-notes" : "musical-notes-outline"} 
            size={16} 
            color={isMusicPlaying ? "#001524" : (currentLevel === 2 ? "#fff" : "#4ade80")} 
          />
          <Text style={[styles.piliemonText, isMusicPlaying && styles.piliemonTextActive, currentLevel === 2 && !isMusicPlaying && { color: '#fff' }]}>PILIEMON</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsManualMode(!isManualMode)} style={[styles.modeToggle, currentLevel === 2 && { borderColor: '#fff' }]}>
          <Text style={[styles.modeToggleText, currentLevel === 2 && { color: '#fff' }]}>{isManualMode ? "AUTO" : "MANUAL"}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => setShowMechanics(true)} style={styles.headerIconButton}>
          <Ionicons name="help-circle-outline" size={24} color={currentLevel === 2 ? "#fff" : "#4ade80"} />
        </TouchableOpacity>
      </View>

      <Pressable 
        style={styles.gameArea} 
        onPress={() => !isManualMode && gameState === 'IDLE' && selectorRef.current?.handleStop()}
      >
        {/* DRAGGABLE TRIVIA BUTTON */}
        <Animated.View 
          {...panResponder.panHandlers}
          style={[
            styles.floatingTriviaBtn, 
            { transform: pan.getTranslateTransform() },
            currentLevel === 2 && { backgroundColor: 'rgba(255,255,255,0.2)', borderColor: '#fff' }
          ]}
        >
          <TouchableOpacity 
            onPress={showRandomTrivia} 
            style={styles.fullTouch}
            activeOpacity={0.7}
          >
            <Ionicons name="bulb" size={24} color={currentLevel === 2 ? "#fff" : "#4ade80"} />
          </TouchableOpacity>
        </Animated.View>

        {floatingValue && (
          <Animated.View style={[
            styles.floatingIndicator,
            { opacity: opacityAnim, transform: [{ translateY: floatAnim }], borderColor: currentLevel === 2 ? '#fff' : '#4ade80' }
          ]}>
            <Text style={[styles.floatingText, currentLevel === 2 && { color: '#fff' }]}>{floatingValue}</Text>
          </Animated.View>
        )}

        <View style={styles.topSelectorWrapper}>
          {gameState === 'IDLE' && (
            isManualMode ? (
              <View style={styles.manualArea}>
                <View style={styles.grid}>
                  {availableNumbers.map(num => (
                    <TouchableOpacity 
                      key={num} 
                      onPress={() => onToggleNumberWithEffect(num)} 
                      style={[styles.numBtn, selectedSet.includes(num) && styles.activeNumBtn, currentLevel === 2 && { borderColor: 'rgba(255,255,255,0.3)' }]}
                    >
                      <Text style={[styles.numText, selectedSet.includes(num) && styles.activeNumText]}>{num}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {selectedSet.length === required && (
                  <TouchableOpacity style={styles.hookBtn} onPress={handleHookNow}>
                    <Text style={styles.hookBtnText}>CAST ALL LINES</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <LevelSelector 
                ref={selectorRef}
                levels={availableNumbers}
                onSelectionTriggered={onAutoSelection} 
                disabled={gameState !== 'IDLE'}
              />
            )
          )}
        </View>

        <LottieView source={require('../../assets/gifs/Dolphin Jumping.json')} autoPlay loop style={styles.dolphinBackground} />
        <LottieView source={require('../../assets/gifs/sea waves.json')} autoPlay loop style={[styles.waveBackground, currentLevel === 2 && { tintColor: '#fdba74', opacity: 0.5 }]} />

        <Animated.View style={[styles.visualizationContainer, { transform: [{ translateX: shakeAnim }] }]}>
          <View style={styles.visualArea}>
            {activePhrase !== "" && <CatchDialogue text={activePhrase} />}
            
            {gameState === 'IDLE' || multiOutcomes.length <= 1 ? (
              <View style={styles.mainCharWrapper}>
                <LottieView source={require('../../assets/gifs/humanfishing.json')} autoPlay loop={gameState !== 'RESULT'} style={styles.mainChar} />
              </View>
            ) : (
              <View style={styles.multiFisherRow}>
                {multiOutcomes.map((item, index) => {
                  const itemWidth = currentLevel === 3 ? (width / 3.5) : (width / 3.2);
                  return (
                    <View key={index} style={[styles.fisherColumn, { width: itemWidth }]}>
                      <Text style={[styles.fisherLabel, currentLevel === 2 && { color: '#fff' }]}>#{item.num}</Text>
                      <LottieView source={require('../../assets/gifs/humanfishing.json')} autoPlay loop style={styles.largeFisher} />
                      {gameState === 'RESULT' && (
                        <View style={styles.individualResultOverlay}>
                          <LottieView 
                            source={item.isShark ? require('../../assets/gifs/shark.json') : require('../../assets/gifs/smallfish.json')}
                            autoPlay
                            style={styles.miniAnim}
                          />
                          <Text style={[styles.miniStatus, {color: item.isShark ? '#ef4444' : (currentLevel === 2 ? '#fff' : '#4ade80')}]}>
                            {item.isShark ? 'SHARK' : 'FISH'}
                          </Text>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            )}

            {(gameState === 'RESULT' && multiOutcomes.length <= 1) && (
              <View style={styles.outcomeOverlay}>
                <View style={styles.singleResultContainer}>
                  <Animated.Text style={[multiOutcomes[0]?.isShark ? styles.baitText : styles.goodCatchText, { opacity: fadeAnim }, !multiOutcomes[0]?.isShark && currentLevel === 2 && { color: '#fff' }]}>
                    {multiOutcomes[0]?.isShark ? "BAIT!" : 'CATCH!'}
                  </Animated.Text>
                  <LottieView
                    source={multiOutcomes[0]?.isShark ? require('../../assets/gifs/shark.json') : require('../../assets/gifs/smallfish.json')}
                    autoPlay
                    loop={!multiOutcomes[0]?.isShark}
                    style={styles.outcomeAnim}
                  />
                </View>
              </View>
            )}
          </View>
        </Animated.View>
      </Pressable>

      {/* MODALS */}
      <Modal visible={randomTriviaVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { borderColor: '#4ade80', borderLeftWidth: 4 }]}>
            <Text style={[styles.modalTitle, { color: '#4ade80' }]}>SHARK FACT</Text>
            <View style={styles.triviaBox}>
              <Text style={styles.triviaText}>{selectedTrivia}</Text>
            </View>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#4ade80' }]} onPress={() => setRandomTriviaVisible(false)}>
              <Text style={styles.btnText}>GOT IT!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <MechanicsModal visible={showMechanics} onClose={() => setShowMechanics(false)} stage={currentLevel} description={currentMechanics} />

      <Modal visible={audioAlertVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>AUDIO ACTIVE</Text>
            <View style={styles.triviaBox}>
              <Text style={styles.triviaText}>The PILIEMON frequency is already active.</Text>
            </View>
            <TouchableOpacity style={styles.actionBtn} onPress={() => setAudioAlertVisible(false)}>
              <Text style={styles.btnText}>ACKNOWLEDGE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
            <TouchableOpacity style={[styles.actionBtn, modalType === 'WIN' && styles.winBtn]} onPress={proceed}>
              <Text style={[styles.btnText, modalType === 'WIN' && styles.winBtnText]}>
                {modalType === 'WIN' ? (currentLevel < 3 ? "NEXT LEVEL" : "FINISH MISSION") : "RESTART MISSION"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  sun: { position: 'absolute', top: 120, right: 40, width: 80, height: 80, borderRadius: 40, backgroundColor: '#fed7aa', opacity: 0.8, shadowColor: '#fb923c', shadowRadius: 20, shadowOpacity: 1, elevation: 10 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 25, paddingTop: 20, paddingBottom: 20, zIndex: 10, justifyContent: 'space-between' },
  backButton: { padding: 4 },
  headerIconButton: { padding: 5 },
  // Updated Styles for Draggable Button
  floatingTriviaBtn: { position: 'absolute', width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(74, 222, 128, 0.1)', borderWidth: 1, borderColor: '#4ade80', zIndex: 999, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5 },
  fullTouch: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  modeToggle: { borderWidth: 1, borderColor: '#4ade80', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  modeToggleText: { color: '#4ade80', fontSize: 10, fontWeight: 'bold' },
  piliemonBtn: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#4ade80', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginRight: 8 },
  piliemonBtnActive: { backgroundColor: '#4ade80' },
  piliemonText: { color: '#4ade80', fontSize: 10, fontWeight: 'bold', marginLeft: 4 },
  piliemonTextActive: { color: '#001524' },
  headerTitle: { color: '#fafafa', fontSize: 12, fontWeight: '800' },
  subTitle: { color: '#71717a', fontSize: 9, fontWeight: '600' },
  gameArea: { flex: 1, position: 'relative' },
  floatingIndicator: { position: 'absolute', top: '45%', left: width / 2 - 30, width: 60, height: 60, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 30, borderWidth: 2, borderColor: '#4ade80', justifyContent: 'center', alignItems: 'center', zIndex: 99 },
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
  waveBackground: { position: 'absolute', width: '100%', height: 300, opacity: 0.8, bottom: -10, zIndex: 1 },
  dolphinBackground: { position: 'absolute', width: width * 0.5, height: 150, bottom: 50, right: 100, zIndex: 0, opacity: 0.6 },
  visualizationContainer: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 60 },
  visualArea: { width: '100%', alignItems: 'center', position: 'relative', minHeight: 350 },
  mainCharWrapper: { position: 'relative', alignItems: 'center' },
  mainChar: { width: 600, height: 600, zIndex: 2, marginBottom: -60 },
  multiFisherRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', width: '100%', zIndex: 2, paddingHorizontal: 10 },
  fisherColumn: { alignItems: 'center', marginVertical: 5, position: 'relative' },
  fisherLabel: { color: '#4ade80', fontSize: 10, fontWeight: 'bold', marginBottom: -10 },
  largeFisher: { width: 180, height: 180 },
  individualResultOverlay: { position: 'absolute', top: -10, alignItems: 'center', justifyContent: 'center', width: '100%' },
  miniAnim: { width: 85, height: 85 },
  miniStatus: { fontSize: 10, fontWeight: '900', marginTop: -15, textShadowColor: '#000', textShadowRadius: 3 },
  outcomeOverlay: { position: 'absolute', bottom: 100, width: '100%', zIndex: 5, alignItems: 'center' },
  singleResultContainer: { alignItems: 'center' },
  goodCatchText: { color: '#4ade80', fontSize: 32, fontWeight: '900', marginBottom: -40, zIndex: 6, textShadowColor: '#000', textShadowRadius: 4 },
  baitText: { color: '#ef4444', fontSize: 24, fontWeight: '900', marginBottom: -40, zIndex: 6, textShadowColor: '#000', textShadowRadius: 4 },
  outcomeAnim: { width: 300, height: 300 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 21, 36, 0.98)', justifyContent: 'center', alignItems: 'center', padding: 30 },
  modalContent: { width: '100%', backgroundColor: '#022c43', padding: 30, borderLeftWidth: 4, borderColor: '#ef4444' },
  winBorder: { borderColor: '#FFECD1' },
  modalTitle: { color: '#ef4444', fontSize: 24, fontWeight: '900', marginBottom: 20 },
  winTitleText: { color: '#FFECD1' },
  triviaBox: { marginBottom: 30 },
  triviaLabel: { color: '#71717a', fontSize: 10, fontWeight: '800', marginBottom: 8 },
  triviaText: { color: '#fafafa', fontSize: 16, lineHeight: 24 },
  actionBtn: { backgroundColor: '#ef4444', paddingVertical: 15, alignItems: 'center' },
  winBtn: { backgroundColor: '#FFECD1' },
  btnText: { color: '#fafafa', fontWeight: '900', fontSize: 12 },
  winBtnText: { color: '#001524' }
});