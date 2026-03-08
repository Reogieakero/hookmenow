import React, { useRef } from 'react';
import { StyleSheet, Animated, PanResponder, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const ICON_SIZE = 50;

export default function FloatingTriviaButton({ onPress, currentLevel }) {
  const pan = useRef(new Animated.ValueXY({ x: width - ICON_SIZE - 20, y: height - 200 })).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5,
      onPanResponderGrant: () => {
        pan.setOffset({ x: pan.x._value, y: pan.y._value });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: (_, gestureState) => {
        pan.flattenOffset();
        const snapTo = gestureState.moveX > width / 2 ? (width - ICON_SIZE - 20) : 20;
        Animated.spring(pan.x, { toValue: snapTo, useNativeDriver: false, friction: 5 }).start();
      },
    })
  ).current;

  return (
    <Animated.View 
      {...panResponder.panHandlers}
      style={[styles.btn, { transform: pan.getTranslateTransform() }, currentLevel === 2 && styles.lvl2]}
    >
      <TouchableOpacity onPress={onPress} style={styles.touch} activeOpacity={0.7}>
        <Ionicons name="bulb" size={24} color={currentLevel === 2 ? "#fff" : "#4ade80"} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  btn: {
    position: 'absolute',
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    borderWidth: 1,
    borderColor: '#4ade80',
    zIndex: 999,
    elevation: 5,
  },
  lvl2: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderColor: '#fff',
  },
  touch: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});