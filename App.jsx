import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import GameScreen from './src/screens/GameScreen';
import ShopScreen from './src/screens/ShopScreen';
import { useGameAudio } from './src/hooks/useAudio';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('HOME');
  
  const { isMuted, toggleMusic, playEffect } = useGameAudio(require('./assets/sounds/pilemon.mp3'));

  const handleStartGame = () => {
    playEffect(); 
    setCurrentScreen('GAME');
  };

  const handleGoHome = () => {
    setCurrentScreen('HOME');
  };

  const handleOpenShop = () => {
    playEffect();
    setCurrentScreen('SHOP');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'GAME':
        return (
          <GameScreen 
            onBack={handleGoHome} 
            isMusicPlaying={!isMuted}
            onToggleMusic={toggleMusic}
          />
        );
      case 'SHOP':
        return (
          <ShopScreen 
            onBack={handleGoHome} 
          />
        );
      case 'HOME':
      default:
        return (
          <HomeScreen 
            onStart={handleStartGame} 
            onOpenShop={handleOpenShop}
            isMuted={isMuted} 
            onToggleAudio={toggleMusic} 
          />
        );
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {renderScreen()}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001524',
  },
});