import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Pressable, Dimensions } from 'react-native';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import InstructionCard from '../components/InstructionCard';
import { useTypingAnimation } from '../hooks/useTypingAnimation';
import { useScore } from '../hooks/useScore';

const { width, height: screenHeight } = Dimensions.get('window');

export default function HomeScreen({ onStart, isMuted, onToggleAudio, onOpenShop }) {
  const [showInstructions, setShowInstructions] = useState(false);
  const { line1, line2 } = useTypingAnimation("HOOK ME", "NOW", 300);
  const { coins, activeBackground } = useScore();
  const cursorOpacity = useRef(new Animated.Value(0)).current;
  const isUnderwater = activeBackground === 'underwater_theme';

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(cursorOpacity, { toValue: 0, duration: 500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={[styles.container, isUnderwater && { backgroundColor: '#000814' }]}>
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        {isUnderwater ? (
          <LottieView autoPlay loop style={styles.fullScreenLottie} source={require('../../assets/gifs/Underwater Ocean Fish and Turtle.json')} resizeMode="cover" />
        ) : (
          <View style={styles.defaultWaveWrapper}>
            <LottieView autoPlay loop style={styles.dolphinAnimation} source={require('../../assets/gifs/Dolphin Jumping.json')} />
            <LottieView autoPlay loop style={styles.lottieWaves} source={require('../../assets/gifs/sea waves.json')} speed={0.3} />
          </View>
        )}
      </View>

      <View style={styles.nav}>
        <TouchableOpacity style={styles.coinBadge} onPress={onOpenShop}>
          <MaterialIcons name="monetization-on" size={18} color="#fbbf24" />
          <Text style={styles.coinText}>{coins.toLocaleString()}</Text>
        </TouchableOpacity>

        <View style={styles.navRight}>
          <Pressable style={[styles.iconButton, { marginRight: 10 }]} onPress={() => setShowInstructions(true)}>
            <MaterialCommunityIcons name="information-variant" size={20} color="#fafafa" />
          </Pressable>
          <Pressable style={styles.iconButton} onPress={onToggleAudio}>
            <Ionicons name={isMuted ? "volume-mute" : "volume-high"} size={20} color={isMuted ? "#71717a" : "#fafafa"} />
          </Pressable>
        </View>
      </View>

      <View style={styles.main}>
        <Text style={styles.logoEmoji}>🎣</Text>
        <View style={styles.titleContainer}>
          <View style={styles.lineHeightFix}>
             <Text style={styles.titleLine}>{line1}</Text>
             {line2 === '' && line1 !== '' && <Animated.View style={[styles.cursor, { opacity: cursorOpacity }]} />}
          </View>
          <View style={styles.row}>
            <Text style={[styles.titleLine, styles.highlightText]}>{line2}</Text>
            {line2 !== '' && <Animated.View style={[styles.cursor, { opacity: cursorOpacity }]} />}
          </View>
        </View>
        <Text style={styles.description}>
          A high-stakes one-button survival protocol.{"\n"}
          Time your strike. Avoid the apex predator.
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.primaryButton} onPress={onStart}>
          <Text style={styles.primaryButtonText}>Play now</Text>
        </TouchableOpacity>
        <View style={styles.legalContainer}>
            <Text style={styles.legalText}>© 2026 DEEP SEA OPERATIONS</Text>
        </View>
      </View>

      <InstructionCard visible={showInstructions} onClose={() => setShowInstructions(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 28,
    backgroundColor: '#001524',
  },
  fullScreenLottie: {
    width: width,
    height: screenHeight,
    opacity: 0.6,
  },
  defaultWaveWrapper: {
    position: 'absolute',
    bottom: -290,
    left: 0,
    width: width,
    height: screenHeight * 1.2,
    opacity: 0.45,
    justifyContent: 'flex-end',
  },
  lottieWaves: {
    width: width,
    height: '100%',
    transform: [{ scaleY: 1.2 }],
  },
  dolphinAnimation: {
    width: width * 0.6,
    height: 200,
    position: 'absolute',
    top: '40%',
    left: '20%',
    zIndex: 2,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 24,
    zIndex: 20,
  },
  navRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
  },
  coinText: {
    color: '#fbbf24',
    fontSize: 16,
    fontWeight: '900',
    marginLeft: 6,
  },
  iconButton: {
    padding: 10,
    backgroundColor: 'rgba(24, 24, 27, 0.8)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    zIndex: 20,
  },
  logoEmoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  titleContainer: {
    marginBottom: 24,
    minHeight: 120,
  },
  lineHeightFix: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
  },
  titleLine: {
    fontSize: 56,
    fontWeight: '900',
    color: '#fafafa',
    lineHeight: 56,
    letterSpacing: -2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
  },
  highlightText: {
    color: '#FFECD1',
  },
  cursor: {
    width: 6,
    height: 44,
    backgroundColor: '#fafafa',
    marginLeft: 10,
  },
  description: {
    fontSize: 16,
    color: '#a1a1aa',
    lineHeight: 24,
    fontWeight: '400',
    maxWidth: '90%',
  },
  footer: {
    paddingBottom: 60,
    gap: 24,
    zIndex: 20,
  },
  primaryButton: {
    backgroundColor: '#fafafa',
    paddingVertical: 18,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#09090b',
    fontSize: 16,
    fontWeight: '600',
  },
  legalContainer: {
    alignItems: 'center',
  },
  legalText: {
    color: '#3f3f46',
    fontSize: 10,
    letterSpacing: 1,
    fontWeight: '600',
  },
});