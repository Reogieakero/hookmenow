import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const ITEM_SIZE = 70;

const LevelSelector = forwardRef(({ levels, onSelectionTriggered, disabled }, ref) => {
  const flatListRef = useRef(null);
  const intervalRef = useRef(null);
  const [internalIndex, setInternalIndex] = useState(0);

  useImperativeHandle(ref, () => ({
    handleStop: () => {
      if (!disabled && levels.length > 0) {
        const selectedValue = levels[internalIndex];
        if (selectedValue !== undefined && selectedValue !== null) {
          onSelectionTriggered(selectedValue);
        }
      }
    }
  }));

  useEffect(() => {
    if (levels.length === 10) {
      setInternalIndex(0);
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({ index: 0, animated: false });
      }, 50);
    }
  }, [levels.length]);

  useEffect(() => {
    if (!disabled && levels.length > 0) {
      intervalRef.current = setInterval(() => {
        setInternalIndex((prev) => {
          const next = Math.floor(Math.random() * levels.length);
          if (levels[next] !== undefined) {
            flatListRef.current?.scrollToIndex({ index: next, animated: false });
            return next;
          }
          return 0;
        });
      }, 60);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [disabled, levels]);

  const renderItem = ({ item, index }) => (
    <View style={[styles.card, internalIndex === index && styles.activeCard]}>
      <Text style={[styles.levelText, internalIndex === index && styles.activeLevelText]}>
        {item < 10 ? `0${item}` : item}
      </Text>
    </View>
  );

  return (
    <View style={styles.touchArea}>
      <View style={styles.carouselContainer}>
        <FlatList
          ref={flatListRef}
          data={levels}
          renderItem={renderItem}
          keyExtractor={(item) => item.toString()}
          horizontal
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          getItemLayout={(_, index) => ({ length: ITEM_SIZE, offset: ITEM_SIZE * index, index })}
          extraData={internalIndex}
        />
      </View>
      {!disabled && (
        <Text style={styles.hintText}>TAP ANYWHERE TO DEPLOY HOOK</Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  touchArea: {
    width: '100%',
    alignItems: 'center',
  },
  carouselContainer: {
    height: ITEM_SIZE,
    justifyContent: 'center',
    width: width,
  },
  listContent: {
    paddingHorizontal: (width - ITEM_SIZE) / 2,
  },
  card: {
    width: ITEM_SIZE - 20,
    height: ITEM_SIZE - 20,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  activeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: '#4ade80',
    borderWidth: 2,
  },
  levelText: {
    color: '#71717a',
    fontSize: 18,
    fontWeight: '400',
  },
  activeLevelText: {
    color: '#4ade80',
    fontWeight: '900',
  },
  hintText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 12,
  },
});

export default LevelSelector;