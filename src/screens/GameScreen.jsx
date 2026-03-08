import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Pressable, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import LevelSelector from '../components/LevelSelector';
import ConfettiEffect from '../components/ConfettiEffect';
import MechanicsModal from '../components/MechanicsModal';
import CatchDialogue from '../components/CatchDialogue';
import GameHeader from '../components/GameHeader';
import FloatingTriviaButton from '../components/FloatingTriviaButton';
import TriviaModal from '../components/TriviaModal'; // New Import
import { useGameLogic, LEVEL_CONFIGS } from '../hooks/useGameLogic';
import { useScore } from '../hooks/useScore';

const { width, height: screenHeight } = Dimensions.get('window');

const TRIVIA_LIST = ["Sharks have been around for more than 400 million years.", "The whale shark is the largest fish in the world.", "A shark's skin feels similar to sandpaper.", "Most sharks have to keep swimming to stay alive.", "Sharks do not have bones; they have cartilage.", "Some sharks can live for over 400 years.", "A shark can smell a drop of blood from miles away.", "Hammerhead sharks have 360-degree vision.", "Great white sharks can jump 10 feet out of the water.", "Sharks can have up to 30,000 teeth in their lifetime.", "The smallest shark is the dwarf lanternshark, only 8 inches long.", "Sharks play a vital role in the ocean ecosystem.", "Mako sharks are the fastest sharks, reaching 46 mph.", "Not all sharks live in salt water; some live in rivers.", "Sharks have a 'sixth sense' that detects electricity.", "A shark's liver is full of oil to help it float.", "Blue sharks are known for their beautiful blue color.", "Megalodon was an ancient shark three times bigger than a Great White.", "Sharks do not have vocal cords; they are silent hunters.", "Most sharks are cold-blooded, but a few are warm-blooded."];
const CATCH_PHRASES = ["PALDOO!", "HULI!", "LAKING ISDA!", "KUHA!", "PANALO!", "SCORE!", "BINGO!"];
const SHARK_PHRASES = ["OH NO!", "SHARK!", "TAKBO!", "LAGOT!", "AGUY!", "MALAS!"];

export default function GameScreen({ onBack, isMusicPlaying, onToggleMusic }) {
  const selectorRef = useRef();
  const [activePhrase, setActivePhrase] = useState("");
  const [randomTriviaVisible, setRandomTriviaVisible] = useState(false);
  const [selectedTrivia, setSelectedTrivia] = useState("");
  const [floatingValue, setFloatingValue] = useState(null);
  const [scoreAtGameOver, setScoreAtGameOver] = useState(0);
  const [earnedCoins, setEarnedCoins] = useState(0);
  const floatAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const { score, highScore, activeBackground, handleCatchPoints, resetScore, saveHighScore, convertScoreToCoins } = useScore();
  const { currentLevel, catchCount, availableNumbers, gameState, multiOutcomes, showModal, modalType, currentTrivia, shakeAnim, fadeAnim, showMechanics, setShowMechanics, currentMechanics, handleManualSelection, proceed } = useGameLogic(onBack);

  const isUnderwaterEquipped = activeBackground === 'underwater_theme';
  const required = LEVEL_CONFIGS[currentLevel].requiredCatch;

  useEffect(() => {
    if (gameState === 'RESULT' && multiOutcomes.length > 0) {
      const isShark = multiOutcomes.some(o => o.isShark);
      if (isShark) {
        setScoreAtGameOver(score);
        convertScoreToCoins(score).then(amount => setEarnedCoins(amount));
      }
      handleCatchPoints(multiOutcomes);
      const list = isShark ? SHARK_PHRASES : CATCH_PHRASES;
      setActivePhrase(list[Math.floor(Math.random() * list.length)]);
    } else if (gameState === 'IDLE') {
      setActivePhrase("");
    }
  }, [gameState]);

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

  const handleProceed = () => {
    if (modalType === 'LOSE') resetScore();
    else if (modalType === 'WIN' && currentLevel === 3) saveHighScore(score);
    proceed();
  };

  return (
    <View style={[styles.container, { backgroundColor: isUnderwaterEquipped ? '#000814' : (currentLevel === 2 ? '#fb923c' : (currentLevel === 3 ? '#450a0a' : '#001524')) }]}>
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        {isUnderwaterEquipped ? (
          <LottieView source={require('../../assets/gifs/Underwater Ocean Fish and Turtle.json')} autoPlay loop style={styles.fullScreenLottie} resizeMode="cover" />
        ) : (
          <>
            {currentLevel === 2 && <View style={styles.sun} />}
            <LottieView source={require('../../assets/gifs/Dolphin Jumping.json')} autoPlay loop style={styles.dolphin} />
            <LottieView source={require('../../assets/gifs/sea waves.json')} autoPlay loop style={styles.waves} />
          </>
        )}
      </View>

      <GameHeader onBack={onBack} currentLevel={currentLevel} catchCount={catchCount} required={required} isMusicPlaying={isMusicPlaying} onPiliemonPress={onToggleMusic} onShowMechanics={() => setShowMechanics(true)} score={score} />

      <Pressable style={styles.gameArea} onPress={() => gameState === 'IDLE' && selectorRef.current?.handleStop()}>
        <FloatingTriviaButton onPress={showTrivia} currentLevel={currentLevel} />

        <View style={styles.topContainerWrapper}>
          <View style={styles.selectorSection}>
            {gameState === 'IDLE' && <LevelSelector ref={selectorRef} levels={availableNumbers} onSelectionTriggered={(n) => { triggerFeedback(n); handleManualSelection(n); }} disabled={gameState !== 'IDLE'} />}
          </View>
          <View style={styles.minimalScoreRow}>
             <View style={styles.miniStat}><Text style={styles.miniLabel}>SCORE</Text><Text style={styles.miniValue}>{score.toLocaleString()}</Text></View>
             <View style={styles.miniDivider} /><View style={styles.miniStat}><Text style={styles.miniLabel}>BEST</Text><Text style={styles.miniValue}>{highScore.toLocaleString()}</Text></View>
          </View>
        </View>

        {floatingValue && (
          <Animated.View style={[styles.floatingIndicator, { opacity: opacityAnim, transform: [{ translateY: floatAnim }] }]}><Text style={styles.floatingText}>{floatingValue}</Text></Animated.View>
        )}

        <Animated.View style={[styles.visualContainer, { transform: [{ translateX: shakeAnim }] }]}>
          <View style={styles.visualArea}>
            {activePhrase !== "" && <CatchDialogue text={activePhrase} />}
            {gameState === 'RESULT' && (
              <Animated.View style={[styles.catchResultContainer, { opacity: fadeAnim }]}>
                {multiOutcomes.map((o, i) => (
                  <LottieView key={i} source={o.isShark ? require('../../assets/gifs/shark.json') : require('../../assets/gifs/smallfish.json')} autoPlay loop={false} style={styles.catchAnim} />
                ))}
              </Animated.View>
            )}
            <LottieView source={require('../../assets/gifs/humanfishing.json')} autoPlay loop={gameState !== 'RESULT'} style={styles.mainChar} />
          </View>
        </Animated.View>
      </Pressable>

      {showModal && <View style={StyleSheet.absoluteFillObject} pointerEvents="none">{modalType === 'WIN' && <ConfettiEffect />}</View>}
      <TriviaModal 
        visible={showModal}
        onClose={handleProceed}
        title={modalType === 'WIN' ? `STAGE ${currentLevel} COMPLETE` : "GAME OVER"}
        content={currentTrivia}
        isWin={modalType === 'WIN'}
        themeColor={modalType === 'WIN' ? '#FFECD1' : '#ef4444'}
        buttonText={modalType === 'WIN' ? (currentLevel < 3 ? "NEXT LEVEL" : "FINISH MISSION") : "RESTART MISSION"}
        stats={{
          score: modalType === 'WIN' ? score : scoreAtGameOver,
          coins: modalType === 'WIN' ? Math.floor(score/2) : earnedCoins
        }}
      />

      <TriviaModal 
        visible={randomTriviaVisible}
        onClose={() => setRandomTriviaVisible(false)}
        title="SHARK FACT"
        content={selectedTrivia}
        buttonText="AWESOME!"
        themeColor="#4ade80"
      />

      <MechanicsModal visible={showMechanics} onClose={() => setShowMechanics(false)} mechanics={currentMechanics} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fullScreenLottie: {
    width: width,
    height: screenHeight,
    opacity: 0.5,
  },
  sun: {
    position: 'absolute',
    top: 120,
    right: 40,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fed7aa',
    opacity: 0.8,
  },
  gameArea: {
    flex: 1,
  },
  topContainerWrapper: {
    marginTop: 10,
    paddingHorizontal: 30,
    zIndex: 50,
  },
  selectorSection: {
    height: 140,
    justifyContent: 'center',
  },
  minimalScoreRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  miniStat: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  miniDivider: {
    width: 1,
    height: 15,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  miniLabel: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  miniValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '300',
  },
  floatingIndicator: {
    position: 'absolute',
    top: '45%',
    left: width / 2 - 30,
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  floatingText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
  },
  waves: {
    position: 'absolute',
    width: '100%',
    height: 300,
    bottom: -10,
  },
  dolphin: {
    position: 'absolute',
    width: width * 0.5,
    height: 150,
    bottom: 50,
    right: 100,
    opacity: 0.6,
  },
  visualContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 60,
  },
  visualArea: {
    width: '100%',
    alignItems: 'center',
    minHeight: 350,
  },
  catchResultContainer: {
    position: 'absolute',
    top: -100,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  catchAnim: {
    width: 400,
    height: 700,
  },
  mainChar: {
    width: 600,
    height: 600,
    marginBottom: -60,
  },
});