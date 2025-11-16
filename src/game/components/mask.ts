import { Graphics, Container } from 'pixi.js';
import { MASK_CONFIG } from '../constants';

export function createMask(config: any) {
  const { centerX, centerY, debug } = config;

  const container = new Container();

  const width = MASK_CONFIG.WIDTH;
  const height = MASK_CONFIG.HEIGHT;
  const maskX = centerX - width / 2;
  const maskY = centerY - height / 2 + MASK_CONFIG.OFFSET_Y;

  const maskGraphics = new Graphics();
  maskGraphics.rect(maskX, maskY, width, height);
  maskGraphics.fill(MASK_CONFIG.MASK_COLOR);
  container.addChild(maskGraphics);

  let debugLayer;
  if (debug) {
    debugLayer = new Graphics();
    debugLayer.rect(maskX, maskY, width, height);
    debugLayer.fill({ 
      color: MASK_CONFIG.DEBUG_COLOR, 
      alpha: MASK_CONFIG.DEBUG_ALPHA 
    });
  }

  return {
    graphics: maskGraphics,
    container,
    debugLayer,
  };
}
