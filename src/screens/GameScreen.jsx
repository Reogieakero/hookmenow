import React, { useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Animated, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import LevelSelector from '../components/LevelSelector';
import ConfettiEffect from '../components/ConfettiEffect';
import MechanicsModal from '../components/MechanicsModal';
import { useGameLogic, LEVEL_CONFIGS } from '../hooks/useGameLogic';

export default function GameScreen({ onBack }) {
  const selectorRef = useRef();
  const {
    currentLevel, catchCount, availableNumbers, gameState, outcome,
    showModal, modalType, currentTrivia, shakeAnim, fadeAnim,
    showMechanics, setShowMechanics, currentMechanics,
    handleManualSelection, proceed
  } = useGameLogic(onBack);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#71717a" />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.headerTitle}>STAGE_0{currentLevel}</Text>
          <Text style={styles.subTitle}>PROGRESS: {catchCount}/{LEVEL_CONFIGS[currentLevel].requiredCatch}</Text>
        </View>
        <TouchableOpacity onPress={() => setShowMechanics(true)} style={styles.infoButton}>
          <Ionicons name="help-circle-outline" size={24} color="#4ade80" />
        </TouchableOpacity>
      </View>

      <Pressable 
        style={styles.gameArea} 
        onPress={() => {
          if (gameState === 'IDLE' && selectorRef.current) {
            selectorRef.current.handleStop();
          }
        }}
      >
        <View style={styles.topSelectorWrapper}>
          <LevelSelector 
            ref={selectorRef}
            levels={availableNumbers}
            onSelectionTriggered={handleManualSelection} 
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
                <Animated.Text style={[outcome === 'FISH' ? styles.goodCatchText : styles.baitText, { opacity: fadeAnim }]}>
                  {outcome === 'FISH' ? 'GOOD CATCH!' : "YOU'RE THE BAIT"}
                </Animated.Text>
                <LottieView
                  source={outcome === 'SHARK' ? require('../../assets/gifs/shark.json') : require('../../assets/gifs/smallfish.json')}
                  autoPlay
                  loop={outcome === 'FISH'}
                  style={styles.outcomeAnim}
                />
              </View>
            )}
          </View>
        </Animated.View>
      </Pressable>

      <MechanicsModal visible={showMechanics} onClose={() => setShowMechanics(false)} stage={currentLevel} description={currentMechanics} />

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
  container: { flex: 1, backgroundColor: '#001524' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 28, paddingTop: 20, paddingBottom: 20, zIndex: 10, justifyContent: 'space-between' },
  backButton: { padding: 4 },
  infoButton: { padding: 5 },
  headerTitle: { color: '#fafafa', fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  subTitle: { color: '#71717a', fontSize: 9, fontWeight: '600', letterSpacing: 1 },
  gameArea: { flex: 1, position: 'relative' },
  topSelectorWrapper: { paddingTop: 10, zIndex: 10 },
  visualizationContainer: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 50 },
  visualArea: { width: '100%', alignItems: 'center', position: 'relative' },
  waveBackground: { position: 'absolute', width: '100%', height: 300, opacity: 0.8, bottom: 0, zIndex: 1 },
  mainChar: { width: 400, height: 400, zIndex: 2 },
  outcomeOverlay: { position: 'absolute', bottom: 50, width: 320, height: 320, zIndex: 3, alignItems: 'center' },
  goodCatchText: { color: '#4ade80', fontSize: 28, fontWeight: '900', letterSpacing: 3, marginBottom: -40, textShadowColor: 'rgba(0,0,0,0.75)', textShadowOffset: {width: 2, height: 2}, textShadowRadius: 5, zIndex: 4 },
  baitText: { color: '#ef4444', fontSize: 22, fontWeight: '900', letterSpacing: 1, textAlign: 'center', marginBottom: -40, textShadowColor: 'rgba(0,0,0,0.75)', textShadowOffset: {width: 2, height: 2}, textShadowRadius: 5, zIndex: 4 },
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