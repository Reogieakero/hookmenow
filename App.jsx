import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Pressable } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useAudioPlayer } from 'expo-audio'; 
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  const [screen, setScreen] = useState('HOME');
  const [isMuted, setIsMuted] = useState(true);
  
  // Typing States
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  
  const cursorOpacity = useRef(new Animated.Value(0)).current;
  const fullLine1 = "HOOK ME";
  const fullLine2 = "NOW";

  // Audio setup
  const player = useAudioPlayer(require('./assets/sounds/game.mp3'), {
    shouldPlay: false,
    loop: true,
  });

  // 1. Typing Animation Logic (Sequential)
  useEffect(() => {
    let l1Index = 0;
    let l2Index = 0;
    let typingInterval;

    const runAnimation = () => {
      setLine1('');
      setLine2('');
      l1Index = 0;
      l2Index = 0;

      // Start Line 1
      typingInterval = setInterval(() => {
        if (l1Index <= fullLine1.length) {
          setLine1(fullLine1.slice(0, l1Index));
          l1Index++;
        } else if (l2Index <= fullLine2.length) {
          // Start Line 2 after Line 1 finishes
          setLine2(fullLine2.slice(0, l2Index));
          l2Index++;
        } else {
          clearInterval(typingInterval);
          // Loop again after 3 seconds
          setTimeout(runAnimation, 3000);
        }
      }, 100);
    };

    runAnimation();
    return () => clearInterval(typingInterval);
  }, []);

  // 2. Cursor Blinking
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(cursorOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const toggleMusic = () => {
    if (player) {
      if (isMuted) {
        player.play();
        setIsMuted(false);
      } else {
        player.pause();
        setIsMuted(true);
      }
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.nav}>
          
          <Pressable style={styles.iconButton} onPress={toggleMusic}>
            <Ionicons 
              name={isMuted ? "volume-mute" : "volume-high"} 
              size={18} 
              color={isMuted ? "#71717a" : "#fafafa"} 
            />
          </Pressable>
        </View>

        <View style={styles.main}>
          <Text style={styles.logoEmoji}>🎣</Text>
          
          <View style={styles.titleContainer}>
            {/* Line 1 */}
            <View style={styles.lineHeightFix}>
               <Text style={styles.titleLine}>{line1}</Text>
               {line2 === '' && line1 !== '' && (
                 <Animated.View style={[styles.cursor, { opacity: cursorOpacity }]} />
               )}
            </View>
            
            {/* Line 2 */}
            <View style={styles.row}>
              <Text style={[styles.titleLine, styles.highlightText]}>{line2}</Text>
              {line2 !== '' && (
                <Animated.View style={[styles.cursor, { opacity: cursorOpacity }]} />
              )}
            </View>
          </View>

          <View style={styles.separator} />
          
          <Text style={styles.description}>
            A high-stakes one-button survival game. 
            {"\n"}Time to catch fish or be the bait shark.
          </Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={() => setScreen('GAME')}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Play Game</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton} 
            onPress={() => {}}
          >
            <Text style={styles.secondaryButtonText}>View Patch Notes</Text>
          </TouchableOpacity>
          
          <Text style={styles.legalText}>© 2026 DEEP SEA OPERATIONS</Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#001524', paddingHorizontal: 24 },
  nav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20 },
  statusGroup: {
    flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#09090b',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#27272a'
  },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#22c55e' },
  statusText: { color: '#a1a1aa', fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  iconButton: { padding: 10, backgroundColor: '#09090b', borderRadius: 8, borderWidth: 1, borderColor: '#27272a' },
  main: { flex: 1, justifyContent: 'center', alignItems: 'flex-start' },
  logoEmoji: { fontSize: 72, marginBottom: 20 },
  titleContainer: { marginBottom: 16, minHeight: 110 }, // Fixed height prevents layout shift
  lineHeightFix: { flexDirection: 'row', alignItems: 'center', height: 52 },
  titleLine: { fontSize: 52, fontWeight: '900', color: '#fafafa', lineHeight: 52, letterSpacing: -2 },
  row: { flexDirection: 'row', alignItems: 'center', height: 52 },
  highlightText: { color: '#FFECD1' },
  cursor: { width: 8, height: 40, backgroundColor: '#22c55e', marginLeft: 8 },
  separator: { width: 40, height: 2, backgroundColor: '#22c55e', marginVertical: 20 },
  description: { fontSize: 16, color: '#71717a', lineHeight: 24, fontWeight: '500' },
  footer: { paddingBottom: 40, gap: 12 },
  primaryButton: { backgroundColor: '#fafafa', paddingVertical: 16, borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  primaryButtonText: { color: '#09090b', fontSize: 15, fontWeight: '600' },
  secondaryButton: { backgroundColor: 'transparent', paddingVertical: 14, borderRadius: 8, borderWidth: 1, borderColor: '#27272a', justifyContent: 'center', alignItems: 'center' },
  secondaryButtonText: { color: '#a1a1aa', fontSize: 14, fontWeight: '500' },
  legalText: { textAlign: 'center', color: '#3f3f46', fontSize: 10, marginTop: 10, letterSpacing: 1 },
});