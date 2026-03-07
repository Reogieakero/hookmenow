import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Pressable, Dimensions, Animated } from 'react-native';

const { width } = Dimensions.get('window');
const ITEM_SIZE = 70;

export default function LevelSelector({ levels, onSelectionComplete, onSpinStateChange, disabled }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const intervalRef = useRef(null);
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (levels.length > 0 && currentIndex >= levels.length) {
      setCurrentIndex(0);
      flatListRef.current?.scrollToIndex({ index: 0, animated: false });
    }
  }, [levels]);

  const getRandomIndex = (prev) => {
    if (levels.length <= 1) return 0;
    let next = Math.floor(Math.random() * levels.length);
    while (next === prev) next = Math.floor(Math.random() * levels.length);
    return next;
  };

  const startSpin = () => {
    if (disabled || levels.length === 0) return;
    setIsSpinning(true);
    onSpinStateChange(true);
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = getRandomIndex(prev);
        flatListRef.current?.scrollToIndex({ index: next, animated: false });
        return next;
      });
    }, 60);
  };

  const stopSpin = () => {
    clearInterval(intervalRef.current);
    setIsSpinning(false);
    onSpinStateChange(false);
    onSelectionComplete(levels[currentIndex]);
    Animated.sequence([
      Animated.timing(opacityAnim, { toValue: 0.3, duration: 100, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  const handleInteraction = () => {
    if (disabled || levels.length === 0) return;
    if (isSpinning) stopSpin();
    else startSpin();
  };

  const renderItem = ({ item, index }) => {
    const isActive = currentIndex === index;
    return (
      <View style={[styles.card, isActive && styles.activeCard]}>
        <Text style={[styles.levelText, isActive && styles.activeLevelText]}>
          {item < 10 ? `0${item}` : item}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.touchArea}>
      <Pressable onPress={handleInteraction}>
        <View style={styles.carouselContainer}>
          <FlatList
            ref={flatListRef}
            data={levels}
            renderItem={renderItem}
            keyExtractor={(item) => item.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            contentContainerStyle={styles.listContent}
            getItemLayout={(_, index) => ({ length: ITEM_SIZE, offset: ITEM_SIZE * index, index })}
          />
        </View>
        {!disabled && (
          <Animated.Text style={[styles.hintText, { opacity: opacityAnim }]}>
            {isSpinning ? "STOP" : "INITIATE SHUFFLE"}
          </Animated.Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  touchArea: { width: '100%', alignItems: 'center' },
  carouselContainer: { height: ITEM_SIZE, justifyContent: 'center', width: width },
  listContent: { paddingHorizontal: (width - ITEM_SIZE) / 2 },
  card: { width: ITEM_SIZE - 20, height: ITEM_SIZE - 20, borderRadius: 2, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)', justifyContent: 'center', alignItems: 'center', marginHorizontal: 10 },
  activeCard: { backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: '#FFECD1', borderWidth: 1 },
  levelText: { color: '#27272a', fontSize: 18, fontWeight: '400', letterSpacing: 1 },
  activeLevelText: { color: '#FFECD1', fontWeight: '700' },
  hintText: { color: '#3f3f46', fontSize: 9, fontWeight: '700', letterSpacing: 2, marginTop: 12, textAlign: 'center' }
});