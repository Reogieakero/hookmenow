import { useState, useEffect } from 'react';
import { useAudioPlayer } from 'expo-audio';

export const useGameAudio = (asset) => {
  const [isMuted, setIsMuted] = useState(true); // Default to muted
  const player = useAudioPlayer(asset);

  useEffect(() => {
    if (player) {
      player.loop = true;
      // Ensure it is paused on initialization
      player.pause(); 
    }
  }, [player]);

  const toggleMusic = () => {
    if (!player) return;
    
    if (isMuted) {
      player.play();
      setIsMuted(false);
    } else {
      player.pause();
      setIsMuted(true);
    }
  };

  const playEffect = () => {
    if (player && !isMuted) {
      player.play();
    }
  };

  return { isMuted, toggleMusic, playEffect };
};