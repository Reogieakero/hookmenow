import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Alert } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { useScore } from '../hooks/useScore';

export default function ShopScreen({ onBack }) {
  const { coins, deductCoins, ownedItems, purchaseItem, activeBackground, setActiveBackground } = useScore();
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('SUCCESS'); 
  
  const ITEM_ID = 'underwater_theme';
  const PRICE = 1200;
  const isOwned = ownedItems.includes(ITEM_ID);
  const isActive = activeBackground === ITEM_ID;

  const handleAction = () => {
    if (isOwned) {
      setActiveBackground(isActive ? 'default' : ITEM_ID);
      return;
    }

    if (coins < PRICE) {
      setModalType('ERROR');
      setShowModal(true);
      return;
    }

    const success = purchaseItem(ITEM_ID, PRICE);
    if (success) {
      setModalType('SUCCESS');
      setShowModal(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backCircle}>
          <Ionicons name="chevron-back" size={24} color="#fafafa" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerLabel}>SYSTEM</Text>
          <Text style={styles.headerTitle}>MARKET</Text>
        </View>
        <View style={styles.coinBadge}>
          <MaterialIcons name="monetization-on" size={16} color="#fbbf24" />
          <Text style={styles.coinText}>{coins.toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.productContainer}>
        <View style={styles.glassCard}>
          <View style={styles.previewBox}>
            <LottieView
              source={require('../../assets/gifs/Underwater Ocean Fish and Turtle.json')}
              autoPlay loop style={styles.lottiePreview}
            />
            {isOwned && (
              <View style={styles.ownedTag}>
                <Text style={styles.ownedTagText}>OWNED</Text>
              </View>
            )}
          </View>
          
          <View style={styles.details}>
            <View style={styles.detailsHeader}>
              <Text style={styles.productName}>DEEP ABYSS</Text>
              <Text style={styles.productSeries}>VFX_MOD_01</Text>
            </View>
            
            <Text style={styles.description}>
              Override standard environmental protocols with high-fidelity marine life and dynamic underwater lighting.
            </Text>

            <View style={styles.footerRow}>
                <View>
                    <Text style={styles.priceLabel}>{isOwned ? "STATUS" : "PRICE"}</Text>
                    <View style={styles.priceRow}>
                        {!isOwned && <MaterialIcons name="monetization-on" size={14} color="#fbbf24" />}
                        <Text style={styles.priceValue}>{isOwned ? (isActive ? "ACTIVE" : "READY") : PRICE}</Text>
                    </View>
                </View>
                <TouchableOpacity 
                    style={[styles.buyBtn, isActive && styles.activeBtn, !isOwned && coins < PRICE && styles.disabledBtn]} 
                    onPress={handleAction}
                >
                    <Text style={[styles.buyBtnText, isActive && styles.activeBtnText]}>
                        {isOwned ? (isActive ? "EQUIPPED" : "EQUIP") : "ACQUIRE"}
                    </Text>
                </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={[styles.statusIcon, modalType === 'ERROR' && { borderColor: '#ef4444' }]}>
               <Ionicons 
                name={modalType === 'SUCCESS' ? "checkmark-shield" : "warning"} 
                size={40} 
                color={modalType === 'SUCCESS' ? "#4ade80" : "#ef4444"} 
               />
            </View>
            <Text style={styles.statusTitle}>
                {modalType === 'SUCCESS' ? "PURCHASE VERIFIED" : "ACCESS DENIED"}
            </Text>
            <Text style={styles.statusSub}>
                {modalType === 'SUCCESS' 
                  ? "The Deep Abyss module has been added to your inventory." 
                  : "Insufficient credits to complete this transaction."}
            </Text>
            <TouchableOpacity style={[styles.closeBtn, modalType === 'ERROR' && { backgroundColor: '#ef4444' }]} onPress={() => setShowModal(false)}>
              <Text style={styles.closeBtnText}>CONTINUE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#001524', paddingHorizontal: 24 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 20, marginBottom: 40 },
  backCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  headerCenter: { alignItems: 'center' },
  headerLabel: { color: '#71717a', fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  headerTitle: { color: '#fafafa', fontSize: 18, fontWeight: '900' },
  coinBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(251, 191, 36, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.2)' },
  coinText: { color: '#fbbf24', fontSize: 14, fontWeight: '900', marginLeft: 4 },
  productContainer: { flex: 1, justifyContent: 'center' },
  glassCard: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 32, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' },
  previewBox: { height: 280, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  lottiePreview: { width: '120%', height: '120%' },
  ownedTag: { position: 'absolute', top: 20, right: 20, backgroundColor: 'rgba(74, 222, 128, 0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#4ade80' },
  ownedTagText: { color: '#4ade80', fontSize: 10, fontWeight: '900' },
  details: { padding: 24 },
  detailsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  productName: { color: '#fafafa', fontSize: 24, fontWeight: '900' },
  productSeries: { color: '#71717a', fontSize: 10, fontWeight: '800' },
  description: { color: '#a1a1aa', fontSize: 14, lineHeight: 22, marginBottom: 30 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceLabel: { color: '#71717a', fontSize: 10, fontWeight: '900' },
  priceRow: { flexDirection: 'row', alignItems: 'center' },
  priceValue: { color: '#fafafa', fontSize: 20, fontWeight: '900' },
  buyBtn: { backgroundColor: '#fafafa', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 14 },
  activeBtn: { backgroundColor: '#4ade80' },
  activeBtnText: { color: '#000' },
  disabledBtn: { opacity: 0.2 },
  buyBtnText: { color: '#000', fontWeight: '900', fontSize: 13 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', justifyContent: 'center', alignItems: 'center', padding: 40 },
  modalContent: { width: '100%', backgroundColor: '#09090b', borderRadius: 32, padding: 32, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  statusIcon: { width: 70, height: 70, borderRadius: 35, borderWidth: 1, borderColor: '#4ade80', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  statusTitle: { color: '#fafafa', fontSize: 18, fontWeight: '900', marginBottom: 10 },
  statusSub: { color: '#71717a', fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 25 },
  closeBtn: { width: '100%', backgroundColor: '#4ade80', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  closeBtnText: { color: '#000', fontWeight: '900' }
});