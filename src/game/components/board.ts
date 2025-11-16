import { Container, Sprite } from 'pixi.js';
import { createSymbols, createSymbol } from './symbols';
import { createMask } from './mask';
import { SPIN_ANIMATION, SYMBOL_CONFIG } from '../constants';
import { runFastSpinPhase, runStopPhase, processWinResult } from './spinPhases';
import { loadGameAssets } from '../assets';

export async function createBoard(config: any) {
  const assets = await loadGameAssets();
  
  const {
    centerX,
    centerY,
    boardScale,
    symbolWidth,
    symbolHeight,
    symbolsOffsetY,
  } = config;

  const mainContainer = new Container();

  const boardSprite = new Sprite(assets.board);
  boardSprite.anchor.set(0.5);
  boardSprite.x = centerX;
  boardSprite.y = centerY;
  boardSprite.scale.set(boardScale);
  mainContainer.addChild(boardSprite);

  const mask = createMask({ centerX, centerY });
  mainContainer.addChild(mask.container);

  const symbolsContainer = new Container();
  symbolsContainer.mask = mask.graphics;
  mainContainer.addChild(symbolsContainer);

  if (mask.debugLayer) {
    mainContainer.addChild(mask.debugLayer);
  }

  const symbols = createSymbols({
    centerX,
    centerY,
    symbolWidth,
    symbolHeight,
    offsetY: symbolsOffsetY,
    textures: assets.symbols,
  });
  symbolsContainer.addChild(symbols.container);

  const reelSymbols: any = {};
  const reelRowHeight = 
    symbols.positions[SYMBOL_CONFIG.COLUMNS]?.y - symbols.positions[0]?.y || 
    SYMBOL_CONFIG.DEFAULT_ROW_HEIGHT;
  
  const addReelSymbol = (col: number, yPosition: number) => {
    const symbolValue = symbols.getRandomSymbol();
    const symbol = createSymbol(
      symbolValue,
      symbols.positions[col].x,
      yPosition,
      symbolWidth,
      symbolHeight,
      assets.symbols
    );
    symbolsContainer.addChild(symbol);
    return symbol;
  };
  
  for (let col = 0; col < SYMBOL_CONFIG.COLUMNS; col++) {
    reelSymbols[col] = [];
    
    for (let i = -SPIN_ANIMATION.SYMBOLS_ABOVE; i < 0; i++) {
      const yPosition = symbols.positions[col].y + i * reelRowHeight;
      reelSymbols[col].push(addReelSymbol(col, yPosition));
    }
    
    for (let row = 0; row < SYMBOL_CONFIG.ROWS; row++) {
      const index = row * SYMBOL_CONFIG.COLUMNS + col;
      reelSymbols[col].push(symbols.symbols[index]);
    }
    
    for (let i = 1; i <= SPIN_ANIMATION.SYMBOLS_BELOW; i++) {
      const yPosition = symbols.positions[col + SYMBOL_CONFIG.COLUMNS * 2].y + i * reelRowHeight;
      reelSymbols[col].push(addReelSymbol(col, yPosition));
    }
  }

  let isSpinningFlag = false;

  async function spin(): Promise<boolean> {
    if (isSpinningFlag) return false;
    isSpinningFlag = true;

    const config = {
      frameTime: SPIN_ANIMATION.FRAME_TIME,
      spinSpeed: SPIN_ANIMATION.SPEED,
      spinDuration: SPIN_ANIMATION.DURATION,
      columnDelays: SPIN_ANIMATION.COLUMN_DELAYS,
      rowHeight: reelRowHeight,
      bottomBoundary: symbols.positions[SYMBOL_CONFIG.COLUMNS * 2].y + reelRowHeight,
    };

    const reelContext = {
      reelSymbols,
      symbolPositions: symbols.positions,
      createNewSymbol: (col: number, yPosition: number) => {
        const columnX = symbols.positions[col].x;
        const symbolValue = symbols.getRandomSymbol();
        const newSymbol = createSymbol(
          symbolValue,
          columnX,
          yPosition,
          symbolWidth,
          symbolHeight,
          assets.symbols
        );
        symbolsContainer.addChild(newSymbol);
        return newSymbol;
      },
      checkWin: (grid: number[]) => symbols.checkWin(grid),
    };

    await runFastSpinPhase(config, reelContext);
    const { finalGrid, finalVisibleSymbols } = await runStopPhase(config, reelContext);
    const hasWin = processWinResult(finalGrid, finalVisibleSymbols, reelContext.checkWin);
    
    isSpinningFlag = false;
    return hasWin;
  }

  function isSpinning() {
    return isSpinningFlag;
  }

  return {
    container: mainContainer,
    spin,
    isSpinning,
  };
}
