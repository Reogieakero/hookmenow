import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function GameScreen({ onBack }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="close" size={24} color="#fafafa" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PROTOCOL: ACTIVE</Text>
      </View>

      <View style={styles.gameArea}>
        <Text style={styles.placeholderText}>LEVEL SELECTOR 1-10</Text>
        {/* We can build your 1-10 selector here next */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#001524',
    padding: 20 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8
  },
  headerTitle: {
    color: '#fafafa',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
    marginLeft: 15
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    borderStyle: 'dashed'
  },
  placeholderText: {
    color: '#3f3f46',
    fontWeight: '600'
  }
});