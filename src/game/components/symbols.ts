import { Container, Sprite } from 'pixi.js';
import { SYMBOL_CONFIG } from '../constants';

export function createSymbol(
  symbolValue: number,
  x: number,
  y: number,
  symbolWidth: number,
  symbolHeight: number,
  textures: any
): Sprite {
  const texture = textures[`symbol${symbolValue}`];
  const sprite = new Sprite(texture);
  sprite.anchor.set(0.5);
  sprite.width = symbolWidth;
  sprite.height = symbolHeight;
  sprite.x = x;
  sprite.y = y;
  (sprite as any).userData = { symbolValue };
  return sprite;
}

export function createSymbols(config: any) {
  const {
    centerX,
    centerY,
    symbolWidth,
    symbolHeight,
    offsetY,
    textures,
  } = config;

  const container = new Container();
  const symbols = [];
  const positions = [];

  const symbolSize = SYMBOL_CONFIG.GRID_SIZE;
  const symbolGap = SYMBOL_CONFIG.GRID_GAP;

  const startX = centerX - symbolSize - symbolGap;
  const startY = centerY - symbolSize - symbolGap + offsetY;

  for (let row = 0; row < SYMBOL_CONFIG.ROWS; row++) {
    for (let col = 0; col < SYMBOL_CONFIG.COLUMNS; col++) {
      const randomNumber = Math.floor(Math.random() * SYMBOL_CONFIG.COUNT) + 1;

      const posX = Math.round(startX + col * (symbolSize + symbolGap));
      const posY = Math.round(startY + row * (symbolSize + symbolGap));

      const symbol = createSymbol(
        randomNumber,
        posX,
        posY,
        symbolWidth,
        symbolHeight,
        textures
      );

      positions.push({ x: posX, y: posY });
      container.addChild(symbol);
      symbols.push(symbol);
    }
  }

  function getRandomSymbol() {
    return Math.floor(Math.random() * SYMBOL_CONFIG.COUNT) + 1;
  }

  function checkWin(grid: number[]) {
    for (let row = 0; row < SYMBOL_CONFIG.ROWS; row++) {
      const start = row * SYMBOL_CONFIG.COLUMNS;
      if (grid[start] === grid[start + 1] && grid[start + 1] === grid[start + 2]) {
        return row;
      }
    }
    return -1;
  }

  return {
    container,
    symbols,
    positions,
    getRandomSymbol,
    checkWin,
  };
}

