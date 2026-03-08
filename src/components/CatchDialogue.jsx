import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function CatchDialogue({ text }) {
  return (
    <View style={styles.dialogueContainer}>
      <Svg width="110" height="55" viewBox="0 0 100 50">
        <Path
          d="M5,5 H95 A5,5 0 0,1 100,10 V35 A5,5 0 0,1 95,40 H40 L30,48 L35,40 H5 A5,5 0 0,1 0,35 V10 A5,5 0 0,1 5,5 Z"
          fill="white"
          stroke="#4ade80"
          strokeWidth="2"
        />
      </Svg>
      <View style={styles.textWrapper}>
        <Text style={styles.dialogueText}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dialogueContainer: {
    position: 'absolute',
    top: 240,
    right: 5,
    width: 110,
    height: 55,
    zIndex: 999,
    elevation: 10,
  },
  textWrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 8,
    paddingHorizontal: 10,
  },
  dialogueText: {
    color: '#001524',
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});