import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function MechanicsModal({ visible, onClose, mechanics }) {
  if (!mechanics) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>
            STAGE {mechanics.stage ? `0${mechanics.stage}` : '--'} INTEL
          </Text>
          <Text style={styles.description}>
            {mechanics.description || "No data available for this sector."}
          </Text>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.btnText}>GOT IT</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.85)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 40 
  },
  content: { 
    backgroundColor: '#022c43', 
    padding: 25, 
    width: '100%', 
    borderLeftWidth: 4, 
    borderColor: '#4ade80' 
  },
  title: { 
    color: '#4ade80', 
    fontWeight: '900', 
    fontSize: 18, 
    marginBottom: 15, 
    letterSpacing: 1 
  },
  description: { 
    color: '#fafafa', 
    fontSize: 15, 
    lineHeight: 22, 
    marginBottom: 20 
  },
  closeBtn: { 
    backgroundColor: '#4ade80', 
    padding: 12, 
    alignItems: 'center' 
  },
  btnText: { 
    color: '#001524', 
    fontWeight: '800', 
    fontSize: 12 
  }
});