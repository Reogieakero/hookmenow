import React, { useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Animated, Pressable, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import LevelSelector from '../components/LevelSelector';
import ConfettiEffect from '../components/ConfettiEffect';
import MechanicsModal from '../components/MechanicsModal';
import { useGameLogic, LEVEL_CONFIGS } from '../hooks/useGameLogic';

const { width } = Dimensions.get('window');

export default function GameScreen({ onBack }) {
  const selectorRef = useRef();
  const {
    currentLevel, catchCount, availableNumbers, selectedSet, isManualMode, setIsManualMode,
    gameState, multiOutcomes, showModal, modalType, currentTrivia, shakeAnim, fadeAnim,
    showMechanics, setShowMechanics, currentMechanics,
    handleManualSelection, handleHookNow, toggleNumber, proceed
  } = useGameLogic(onBack);

  const required = LEVEL_CONFIGS[currentLevel].requiredCatch;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#71717a" />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.headerTitle}>STAGE_0{currentLevel}</Text>
          <Text style={styles.subTitle}>
            {isManualMode ? `SELECTED: ${selectedSet.length}/${required}` : `PROGRESS: ${catchCount}/${required}`}
          </Text>
        </View>
        <TouchableOpacity onPress={() => setIsManualMode(!isManualMode)} style={styles.modeToggle}>
          <Text style={styles.modeToggleText}>{isManualMode ? "AUTO" : "MANUAL"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowMechanics(true)} style={styles.infoButton}>
          <Ionicons name="help-circle-outline" size={24} color="#4ade80" />
        </TouchableOpacity>
      </View>

      <View style={styles.gameArea}>
        <View style={styles.topSelectorWrapper}>
          {gameState === 'IDLE' && (
            isManualMode ? (
              <View style={styles.manualArea}>
                <View style={styles.grid}>
                  {availableNumbers.map(num => (
                    <TouchableOpacity 
                      key={num} 
                      onPress={() => toggleNumber(num)} 
                      style={[styles.numBtn, selectedSet.includes(num) && styles.activeNumBtn]}
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
              <Pressable style={{flex: 1}} onPress={() => selectorRef.current?.handleStop()}>
                <LevelSelector 
                  ref={selectorRef}
                  levels={availableNumbers}
                  onSelectionTriggered={handleManualSelection} 
                  disabled={gameState !== 'IDLE'}
                />
              </Pressable>
            )
          )}
        </View>

        <LottieView
          source={require('../../assets/gifs/sea waves.json')}
          autoPlay
          loop
          style={styles.waveBackground}
        />

        <Animated.View style={[styles.visualizationContainer, { transform: [{ translateX: shakeAnim }] }]}>
          <View style={styles.visualArea}>
            {gameState === 'IDLE' || multiOutcomes.length <= 1 ? (
              <LottieView
                source={require('../../assets/gifs/humanfishing.json')}
                autoPlay
                loop={gameState !== 'RESULT'}
                style={styles.mainChar}
              />
            ) : (
              <View style={styles.multiFisherRow}>
                {multiOutcomes.map((item, index) => {
                  const itemWidth = currentLevel === 3 ? (width / 3.5) : (width / 3.2);
                  return (
                    <View key={index} style={[styles.fisherColumn, { width: itemWidth }]}>
                      <Text style={styles.fisherLabel}>#{item.num}</Text>
                      <LottieView source={require('../../assets/gifs/humanfishing.json')} autoPlay loop style={styles.largeFisher} />
                      {gameState === 'RESULT' && (
                        <View style={styles.individualResultOverlay}>
                          <LottieView 
                            source={item.isShark ? require('../../assets/gifs/shark.json') : require('../../assets/gifs/smallfish.json')}
                            autoPlay
                            style={styles.miniAnim}
                          />
                          <Text style={[styles.miniStatus, {color: item.isShark ? '#ef4444' : '#4ade80'}]}>
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
                  <Animated.Text style={[multiOutcomes[0]?.isShark ? styles.baitText : styles.goodCatchText, { opacity: fadeAnim }]}>
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
      </View>

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
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 25, paddingTop: 20, paddingBottom: 20, zIndex: 10, justifyContent: 'space-between' },
  backButton: { padding: 4 },
  infoButton: { padding: 5 },
  modeToggle: { borderWidth: 1, borderColor: '#4ade80', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  modeToggleText: { color: '#4ade80', fontSize: 10, fontWeight: 'bold' },
  headerTitle: { color: '#fafafa', fontSize: 12, fontWeight: '800' },
  subTitle: { color: '#71717a', fontSize: 9, fontWeight: '600' },
  gameArea: { flex: 1, position: 'relative' },
  topSelectorWrapper: { paddingTop: 10, zIndex: 10, height: 180 },
  manualArea: { alignItems: 'center', width: '100%' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  numBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#1e293b', margin: 4, justifyContent: 'center', alignItems: 'center' },
  activeNumBtn: { backgroundColor: '#4ade80', borderColor: '#4ade80' },
  numText: { color: '#71717a', fontWeight: 'bold' },
  activeNumText: { color: '#001524' },
  hookBtn: { backgroundColor: '#4ade80', marginTop: 10, paddingHorizontal: 20, paddingVertical: 6, borderRadius: 4 },
  hookBtnText: { color: '#001524', fontWeight: '900', fontSize: 11 },
  waveBackground: { position: 'absolute', width: '100%', height: 300, opacity: 0.8, bottom: 0, zIndex: 1 },
  visualizationContainer: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 60 },
  visualArea: { width: '100%', alignItems: 'center', position: 'relative', minHeight: 350 },
  mainChar: { width: 400, height: 400, zIndex: 2 },
  multiFisherRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', width: '100%', zIndex: 2, paddingHorizontal: 10 },
  fisherColumn: { alignItems: 'center', marginVertical: 10, position: 'relative' },
  fisherLabel: { color: '#4ade80', fontSize: 10, fontWeight: 'bold', marginBottom: -10 },
  largeFisher: { width: 120, height: 120 },
  individualResultOverlay: { position: 'absolute', top: 10, alignItems: 'center', justifyContent: 'center', width: '100%' },
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