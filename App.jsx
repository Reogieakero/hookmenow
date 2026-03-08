import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import GameScreen from './src/screens/GameScreen';
import { useGameAudio } from './src/hooks/useAudio';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('HOME');
  
  // Update the path here to use pilemon.mp3
  const { isMuted, toggleMusic, playEffect } = useGameAudio(require('./assets/sounds/pilemon.mp3'));

  const handleStartGame = () => {
    playEffect(); 
    setCurrentScreen('GAME');
  };

  const handleGoHome = () => {
    setCurrentScreen('HOME');
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {currentScreen === 'HOME' ? (
          <HomeScreen 
            onStart={handleStartGame} 
            isMuted={isMuted} 
            onToggleAudio={toggleMusic} 
          />
        ) : (
          <GameScreen 
            onBack={handleGoHome} 
            isMusicPlaying={!isMuted}
            onToggleMusic={toggleMusic}
          />
        )}
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