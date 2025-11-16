import { Sprite } from 'pixi.js';
import { UI_CONFIG } from '../constants';

export function createPlayButton(config: any) {
  const { texture, x, y, scale, onClick } = config;

  const button = new Sprite(texture);
  button.anchor.set(0.5);
  button.x = x;
  button.y = y;
  button.scale.set(scale);
  button.eventMode = 'static';
  button.cursor = 'pointer';

  let isEnabled = true;
  const normalScale = scale;
  const pressedScale = scale * UI_CONFIG.BUTTON_PRESSED_SCALE;

  button.on('pointerdown', () => {
    if (isEnabled) button.scale.set(pressedScale);
  });

  button.on('pointerup', () => {
    if (isEnabled) {
      button.scale.set(normalScale);
      if (onClick) onClick();
    }
  });

  button.on('pointerupoutside', () => {
    if (isEnabled) button.scale.set(normalScale);
  });

  function setEnabled(enabled: boolean) {
    isEnabled = enabled;
    button.alpha = enabled ? 1.0 : 0.5;
    button.eventMode = enabled ? 'static' : 'none';
    button.scale.set(enabled ? normalScale : pressedScale);
  }

  return {
    sprite: button,
    setEnabled,
  };
}

