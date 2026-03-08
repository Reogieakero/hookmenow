import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Modal, Pressable, Dimensions, Animated, Easing } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width } = Dimensions.get('window');

export default function InstructionCard({ visible, onClose }) {
  const [renderModal, setRenderModal] = useState(visible);
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setRenderModal(true);
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 300,
        easing: Easing.in(Easing.quad),
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished) setRenderModal(false);
      });
    }
  }, [visible]);

  const morphHeight = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 360],
  });

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-120, 60],
  });

  const borderRadius = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [40, 28],
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 0.1, 1],
    outputRange: [0, 1, 1],
  });

  const contentOpacity = animatedValue.interpolate({
    inputRange: [0, 0.8, 1],
    outputRange: [0, 0, 1],
  });

  if (!renderModal && !visible) return null;

  return (
    <Modal visible={renderModal} transparent animationType="none">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View 
          style={[
            styles.cardContainer, 
            { 
              opacity: opacity,
              height: morphHeight,
              borderRadius: borderRadius,
              transform: [{ translateY }]
            }
          ]}
        >
          <View style={styles.pillHeader}>
            <Ionicons name="checkmark-circle" size={18} color="#4ade80" />
            <Text style={styles.pillText}>Protocol Guide</Text>
          </View>

          <Animated.View style={[styles.cardBody, { opacity: contentOpacity }]}>
            <Text style={styles.bodyText}>
              <Text style={styles.highlight}>1. WATCH THE SELECTOR:</Text> Wait for the numbers to cycle in the game area.{"\n\n"}
              <Text style={styles.highlight}>2. TIME YOUR STRIKE:</Text> Tap the screen to lock in your selection.{"\n\n"}
              <Text style={styles.highlight}>3. AVOID THE SHARK:</Text> Catching a predator results in immediate mission failure.{"\n\n"}
              <Text style={styles.highlight}>4. REACH THE GOAL:</Text> Complete the catch requirement to advance stages.
            </Text>
            
            <View style={styles.footerLine} />
            <Text style={styles.footerHint}>Dismiss Protocol</Text>
          </Animated.View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.82)',
  },
  cardContainer: {
    width: width * 0.9,
    alignSelf: 'center',
    backgroundColor: '#1c1c1e',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  pillHeader: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  pillText: {
    color: '#4ade80',
    fontWeight: '800',
    fontSize: 13,
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  cardBody: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  bodyText: {
    color: '#d4d4d8',
    fontSize: 14,
    lineHeight: 22,
  },
  highlight: {
    color: '#fafafa',
    fontWeight: '900',
  },
  footerLine: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginVertical: 15,
  },
  footerHint: {
    color: '#52525b',
    fontSize: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});