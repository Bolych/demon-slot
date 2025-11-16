import { Container } from 'pixi.js';
import { createPlayButton } from './playButton';
import { createWinInfo } from './winInfo';
import { createBoard } from './board';
import { UI_CONFIG } from '../constants';
import { loadGameAssets } from '../assets';

export async function createGameUI(
  screenWidth: number,
  screenHeight: number,
  stage: Container
): Promise<void> {
  const assets = await loadGameAssets();
  
  const centerX = screenWidth / 2;
  const centerY = screenHeight / 2;
  
  const slotBoard = await createBoard({
    centerX,
    centerY,
    boardScale: UI_CONFIG.BOARD_SCALE,
    symbolsOffsetY: UI_CONFIG.SYMBOLS_OFFSET_Y,
    symbolWidth: UI_CONFIG.SYMBOL_WIDTH,
    symbolHeight: UI_CONFIG.SYMBOL_HEIGHT,
  });
  
  const winInfo = createWinInfo(assets.winInfo, screenWidth, screenHeight);
  
  const playButton = createPlayButton({
    texture: assets.playButton,
    x: centerX + UI_CONFIG.PLAY_BUTTON_OFFSET_X,
    y: screenHeight - UI_CONFIG.PLAY_BUTTON_OFFSET_Y,
    scale: UI_CONFIG.PLAY_BUTTON_SCALE,
    onClick: async () => {
      if (slotBoard.isSpinning()) return;
      
      playButton.setEnabled(false);
      winInfo.text.text = 'Spinning...';
      
      const hasWin = await slotBoard.spin();
      
      winInfo.text.text = hasWin ? 'You Won!' : 'You Lose!';
      playButton.setEnabled(true);
    },
  });
  
  stage.addChild(slotBoard.container);
  stage.addChild(winInfo.container);
  stage.addChild(playButton.sprite);
}

