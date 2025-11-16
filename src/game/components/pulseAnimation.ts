import { Sprite } from 'pixi.js';
import { WIN_PULSE_ANIMATION } from '../constants';

export function pulseSymbols(
  symbols: Sprite[],
  duration: number = WIN_PULSE_ANIMATION.DURATION
) {
  const startTime = Date.now();
  const originalScales: any = {};
  
  symbols.forEach((symbol, index) => {
    originalScales[index] = { x: symbol.scale.x, y: symbol.scale.y };
  });

  const animate = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    const pulseScale = WIN_PULSE_ANIMATION.BASE_SCALE + 
                       WIN_PULSE_ANIMATION.PULSE_AMPLITUDE * 
                       Math.sin(progress * Math.PI * WIN_PULSE_ANIMATION.PULSE_COUNT);
    
    symbols.forEach((symbol, index) => {
      const original = originalScales[index];
      symbol.scale.set(original.x * pulseScale, original.y * pulseScale);
    });

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      symbols.forEach((symbol, index) => {
        const original = originalScales[index];
        symbol.scale.set(original.x, original.y);
      });
    }
  };
  
  requestAnimationFrame(animate);
}

