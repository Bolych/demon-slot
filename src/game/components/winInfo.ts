import { Sprite, Text, Container } from 'pixi.js';
import { UI_CONFIG } from '../constants';

export function createWinInfo(
  texture: any,
  screenWidth: number,
  screenHeight: number
) {
  const container = new Container();
  
  const board = new Sprite(texture);
  board.anchor.set(0.5);
  board.x = screenWidth / 2 + UI_CONFIG.WIN_INFO_OFFSET_X;
  board.y = screenHeight - UI_CONFIG.WIN_INFO_OFFSET_Y;
  board.scale.y = UI_CONFIG.WIN_INFO_SCALE_Y;
  
  const text = new Text({
    text: 'Press Play!',
    style: {
      fontSize: UI_CONFIG.RESULT_TEXT_FONT_SIZE,
      fontWeight: 'bold',
      fill: '#ffffff',
      align: 'center',
      dropShadow: {
        color: '#000000',
        blur: UI_CONFIG.RESULT_TEXT_SHADOW_BLUR,
        angle: UI_CONFIG.RESULT_TEXT_SHADOW_ANGLE,
        distance: UI_CONFIG.RESULT_TEXT_SHADOW_DISTANCE,
      }
    }
  });
  
  text.anchor.set(0.5);
  text.x = board.x;
  text.y = board.y;
  
  container.addChild(board);
  container.addChild(text);
  
  return { container, text };
}

