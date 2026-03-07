import { useState, useEffect } from 'react';

export const useTypingAnimation = (text1, text2, speed = 150) => {
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');

  useEffect(() => {
    let l1Index = 0;
    let l2Index = 0;
    let typingInterval;
    const pauseBetweenLines = 5; 

    const runAnimation = () => {
      setLine1('');
      setLine2('');
      l1Index = 0;
      l2Index = 0;

      typingInterval = setInterval(() => {
        if (l1Index <= text1.length) {
          setLine1(text1.slice(0, l1Index));
          l1Index++;
        } 
        else if (l2Index === 0 && l1Index <= text1.length + pauseBetweenLines) {
          l1Index++; 
        }
        else if (l2Index <= text2.length) {
          setLine2(text2.slice(0, l2Index));
          l2Index++;
        } 
        else {
          clearInterval(typingInterval);
          setTimeout(runAnimation, 4000); 
        }
      }, speed);
    };

    runAnimation();
    return () => clearInterval(typingInterval);
  }, [text1, text2, speed]);

  return { line1, line2 };
};