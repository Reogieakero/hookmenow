import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const COLORS = ['#FFECD1', '#ef4444', '#00A8E8', '#FFD700', '#70e000'];

const ConfettiPiece = ({ index }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  const startX = Math.random() * width;
  const endX = startX + (Math.random() * 200 - 100);
  const rotation = Math.random() * 360;
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  const size = Math.random() * 8 + 6;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 2500 + Math.random() * 1000,
      useNativeDriver: true,
      delay: index * 15,
    }).start();
  }, []);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, height + 50],
  });

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [startX, endX],
  });

  const rotate = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [`${rotation}deg`, `${rotation + 720}deg`],
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 0.8, 1],
    outputRange: [1, 1, 0],
  });

  return (
    <Animated.View
      style={[
        styles.piece,
        {
          backgroundColor: color,
          width: size,
          height: size,
          opacity,
          transform: [{ translateX }, { translateY }, { rotate }],
        },
      ]}
    />
  );
};

export default function ConfettiEffect() {
  const pieces = Array.from({ length: 45 });
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {pieces.map((_, i) => <ConfettiPiece key={i} index={i} />)}
    </View>
  );
}

const styles = StyleSheet.create({
  piece: {
    position: 'absolute',
    top: 0,
    borderRadius: 2,
  },
});