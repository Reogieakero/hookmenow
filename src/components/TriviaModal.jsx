import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';

const TriviaModal = ({ 
  visible, 
  onClose, 
  title, 
  content, 
  buttonText, 
  themeColor = '#4ade80', 
  isWin = false,
  stats = null 
}) => {
  const borderStyle = isWin ? styles.winBorder : { borderColor: themeColor };
  const titleStyle = isWin ? styles.winTitleText : { color: themeColor };
  const buttonStyle = isWin ? styles.winBtn : { backgroundColor: themeColor };
  const buttonTextStyle = isWin ? styles.winBtnText : { color: '#fafafa' };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, borderStyle]}>
          <Text style={[styles.modalTitle, titleStyle]}>{title}</Text>
          
          {stats && (
            <View style={styles.statsRow}>
              <View>
                <Text style={styles.statLabel}>FINAL SCORE</Text>
                <Text style={styles.statValue}>{stats.score.toLocaleString()}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.statLabel, { color: '#fbbf24' }]}>COINS EARNED</Text>
                <Text style={[styles.statValue, { color: '#fbbf24' }]}>+{stats.coins}</Text>
              </View>
            </View>
          )}

          <Text style={styles.triviaLabel}>DID YOU KNOW?</Text>
          <Text style={styles.triviaText}>{content}</Text>
          
          <TouchableOpacity style={[styles.actionBtn, buttonStyle]} onPress={onClose}>
            <Text style={[styles.btnText, buttonTextStyle]}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 21, 36, 0.98)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#022c43',
    padding: 30,
    borderLeftWidth: 4,
  },
  winBorder: {
    borderColor: '#FFECD1',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 20,
  },
  winTitleText: {
    color: '#FFECD1',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 15,
    marginBottom: 20,
    borderRadius: 4,
  },
  statLabel: {
    color: '#71717a',
    fontSize: 9,
    fontWeight: '900',
  },
  statValue: {
    color: '#4ade80',
    fontSize: 20,
    fontWeight: '900',
  },
  triviaLabel: {
    color: '#71717a',
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 8,
  },
  triviaText: {
    color: '#fafafa',
    fontSize: 16,
    lineHeight: 24,
  },
  actionBtn: {
    marginTop: 20,
    paddingVertical: 15,
    alignItems: 'center',
  },
  winBtn: {
    backgroundColor: '#FFECD1',
  },
  btnText: {
    fontWeight: '900',
    fontSize: 12,
  },
  winBtnText: {
    color: '#001524',
  },
});

export default TriviaModal;