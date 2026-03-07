import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import GameScreen from './src/screens/GameScreen'; // Import the new screen
import { useGameAudio } from './src/hooks/useAudio';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('HOME');
  
  // Existing music logic remains untouched
  const { isMuted, toggleMusic, forcePlay } = useGameAudio(require('./assets/sounds/game.mp3'));

  const handleStartGame = () => {
    forcePlay();
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
          <GameScreen onBack={handleGoHome} />
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