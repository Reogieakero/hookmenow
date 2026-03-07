import { useState, useEffect } from 'react';
import { useAudioPlayer } from 'expo-audio';

export const useGameAudio = (asset) => {
  const [isMuted, setIsMuted] = useState(true);
  
  const player = useAudioPlayer(asset, {
    shouldPlay: false,
    loop: true, 
  });

  useEffect(() => {
    if (player) {
      player.loop = true;
    }
  }, [player]);

  const toggleMusic = () => {
    if (!player) return;

    if (isMuted) {
      player.loop = true; 
      player.play();
      setIsMuted(false);
    } else {
      player.pause();
      setIsMuted(true);
    }
  };

  const forcePlay = () => {
    if (player && !player.playing) {
      player.loop = true;
      player.play();
      setIsMuted(false);
    }
  };

  return { isMuted, toggleMusic, forcePlay };
};