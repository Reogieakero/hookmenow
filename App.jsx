import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import { useGameAudio } from './src/hooks/useAudio';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('HOME');
  const { isMuted, toggleMusic, forcePlay } = useGameAudio(require('./assets/sounds/game.mp3'));

  const handleStartGame = () => {
    forcePlay();
    setCurrentScreen('GAME');
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
          <View style={styles.gamePlaceholder}>
            <Text style={{color: 'white'}}>GAME SCREEN COMING SOON</Text>
          </View>
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
  gamePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});