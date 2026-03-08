import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function GameHeader({ onBack, currentLevel, isManualMode, setIsManualMode, catchCount, required, selectedCount, isMusicPlaying, onPiliemonPress, onShowMechanics }) {
  const isLvl2 = currentLevel === 2;
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.back}>
        <Ionicons name="arrow-back" size={20} color={isLvl2 ? "#fff" : "#71717a"} />
      </TouchableOpacity>
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={[styles.title, isLvl2 && { color: '#fff' }]}>STAGE_0{currentLevel}</Text>
        <Text style={[styles.sub, isLvl2 && { color: '#ffedd5' }]}>
          {isManualMode ? `SELECTED: ${selectedCount}/${required}` : `PROGRESS: ${catchCount}/${required}`}
        </Text>
      </View>
      <TouchableOpacity onPress={onPiliemonPress} style={[styles.pBtn, isMusicPlaying && styles.pActive, isLvl2 && { borderColor: '#fff' }]}>
        <Ionicons name={isMusicPlaying ? "musical-notes" : "musical-notes-outline"} size={16} color={isMusicPlaying ? "#001524" : (isLvl2 ? "#fff" : "#4ade80")} />
        <Text style={[styles.pText, isMusicPlaying && styles.pTextActive, isLvl2 && !isMusicPlaying && { color: '#fff' }]}>PILIEMON</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIsManualMode(!isManualMode)} style={[styles.mode, isLvl2 && { borderColor: '#fff' }]}>
        <Text style={[styles.modeText, isLvl2 && { color: '#fff' }]}>{isManualMode ? "AUTO" : "MANUAL"}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onShowMechanics} style={styles.help}>
        <Ionicons name="help-circle-outline" size={24} color={isLvl2 ? "#fff" : "#4ade80"} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 25, paddingTop: 20, paddingBottom: 20, zIndex: 10 },
  back: { padding: 4 },
  title: { color: '#fafafa', fontSize: 12, fontWeight: '800' },
  sub: { color: '#71717a', fontSize: 9, fontWeight: '600' },
  pBtn: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#4ade80', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginRight: 8 },
  pActive: { backgroundColor: '#4ade80' },
  pText: { color: '#4ade80', fontSize: 10, fontWeight: 'bold', marginLeft: 4 },
  pTextActive: { color: '#001524' },
  mode: { borderWidth: 1, borderColor: '#4ade80', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  modeText: { color: '#4ade80', fontSize: 10, fontWeight: 'bold' },
  help: { padding: 5, marginLeft: 5 }
});