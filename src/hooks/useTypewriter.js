import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

/**
 * Types each word out, pauses, deletes it, then moves to the next.
 * With reduced motion on it simply shows the first word, no timers.
 */
export function useTypewriter(words, { typeSpeed = 95, deleteSpeed = 45, holdTime = 1500 } = {}) {
  const prefersReduced = usePrefersReducedMotion();
  const [text, setText] = useState('');
  const state = useRef({ wordIndex: 0, charIndex: 0, deleting: false });

  useEffect(() => {
    if (!words.length) return undefined;

    if (prefersReduced) {
      setText(words[0]);
      return undefined;
    }

    let timer;

    const tick = () => {
      const s = state.current;
      const word = words[s.wordIndex % words.length];
      let delay = s.deleting ? deleteSpeed : typeSpeed;

      if (s.deleting) {
        s.charIndex -= 1;
      } else {
        s.charIndex += 1;
      }

      setText(word.slice(0, s.charIndex));

      if (!s.deleting && s.charIndex === word.length) {
        s.deleting = true;
        delay = holdTime;
      } else if (s.deleting && s.charIndex === 0) {
        s.deleting = false;
        s.wordIndex = (s.wordIndex + 1) % words.length;
        delay = 420;
      }

      timer = setTimeout(tick, delay);
    };

    timer = setTimeout(tick, typeSpeed);
    return () => clearTimeout(timer);
  }, [words, typeSpeed, deleteSpeed, holdTime, prefersReduced]);

  return text;
}
