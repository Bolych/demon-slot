import { Sprite } from 'pixi.js';
import { SPIN_ANIMATION, WIN_PULSE_ANIMATION, SYMBOL_CONFIG } from '../constants';
import { pulseSymbols } from './pulseAnimation';

function moveColumn(
  columnSymbols: any,
  spinSpeed: number,
  bottomBoundary: number,
  rowHeight: number,
  createNewSymbol: any,
  col: number
) {
  for (const symbol of columnSymbols) {
    symbol.y += spinSpeed;
  }

  const bottomSymbol = columnSymbols[columnSymbols.length - 1];
  if (bottomSymbol.y > bottomBoundary) {
    columnSymbols.pop();
    bottomSymbol.parent?.removeChild(bottomSymbol);
    bottomSymbol.destroy();

    const topSymbol = columnSymbols[0];
    const newSymbol = createNewSymbol(col, topSymbol.y - rowHeight);
    columnSymbols.unshift(newSymbol);
  }
}

export async function runFastSpinPhase(
  config: any,
  reelContext: any
): Promise<void> {
  const { frameTime, spinSpeed, spinDuration, columnDelays, bottomBoundary, rowHeight } = config;
  const { reelSymbols, createNewSymbol } = reelContext;
  
  const totalFrames = Math.ceil(spinDuration / frameTime);

  for (let frame = 0; frame < totalFrames; frame++) {
    const elapsed = frame * frameTime;

    for (let col = 0; col < SYMBOL_CONFIG.COLUMNS; col++) {
      const columnDelay = columnDelays[col];
      if (elapsed >= columnDelay) {
        moveColumn(reelSymbols[col], spinSpeed, bottomBoundary, rowHeight, createNewSymbol, col);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, frameTime));
  }
}

function calculateStopDistances(
  reelContext: any,
  rowHeight: number
) {
  const { reelSymbols, symbolPositions } = reelContext;
  const columnTargetDistance: any = {};
  const columnStopped: any = {};

  for (let col = 0; col < SYMBOL_CONFIG.COLUMNS; col++) {
    const topTargetY = symbolPositions[col].y;
    const sortedSymbols = [...reelSymbols[col]].sort((a, b) => a.y - b.y);
    
    let closestSymbol = sortedSymbols[0];
    let minDistance = Infinity;
    
    for (const symbol of sortedSymbols) {
      const distance = Math.abs(symbol.y - topTargetY);
      if (distance < minDistance) {
        minDistance = distance;
        closestSymbol = symbol;
      }
    }
    
    let distanceToGrid = topTargetY - closestSymbol.y;
    
    if (distanceToGrid < 0) {
      distanceToGrid += rowHeight;
    }
    
    if (Math.abs(distanceToGrid) < SPIN_ANIMATION.MIN_STOP_DISTANCE) {
      distanceToGrid = 0;
    }
    
    columnTargetDistance[col] = distanceToGrid;
    columnStopped[col] = distanceToGrid === 0;
  }

  return { distances: columnTargetDistance, stopped: columnStopped };
}

function alignColumnToGrid(
  col: number,
  reelContext: any
) {
  const { reelSymbols, symbolPositions } = reelContext;
  const topTargetY = symbolPositions[col].y;
  const middleTargetY = symbolPositions[col + SYMBOL_CONFIG.COLUMNS].y;
  const bottomTargetY = symbolPositions[col + SYMBOL_CONFIG.COLUMNS * 2].y;
  
  const sortedSymbols = [...reelSymbols[col]].sort((a, b) => a.y - b.y);
  
  let bestSymbols = [];
  let minTotalDistance = Infinity;
  
  for (let start = 0; start <= sortedSymbols.length - SYMBOL_CONFIG.ROWS; start++) {
    const candidate = [sortedSymbols[start], sortedSymbols[start + 1], sortedSymbols[start + 2]];
    const totalDistance = 
      Math.abs(candidate[0].y - topTargetY) +
      Math.abs(candidate[1].y - middleTargetY) +
      Math.abs(candidate[2].y - bottomTargetY);
    
    if (totalDistance < minTotalDistance) {
      minTotalDistance = totalDistance;
      bestSymbols = candidate;
    }
  }
  
  if (bestSymbols.length === SYMBOL_CONFIG.ROWS) {
    const topAdjustment = topTargetY - bestSymbols[0].y;
    const middleAdjustment = middleTargetY - bestSymbols[1].y;
    const bottomAdjustment = bottomTargetY - bestSymbols[2].y;
    
    const maxDownAdjustment = Math.round(Math.max(
      topAdjustment > 0 ? topAdjustment : 0,
      middleAdjustment > 0 ? middleAdjustment : 0,
      bottomAdjustment > 0 ? bottomAdjustment : 0
    ));
    
    if (maxDownAdjustment > 0) {
      for (const symbol of reelSymbols[col]) {
        symbol.y = Math.round(symbol.y + maxDownAdjustment);
      }
    }
    
    bestSymbols[0].y = Math.round(topTargetY);
    bestSymbols[1].y = Math.round(middleTargetY);
    bestSymbols[2].y = Math.round(bottomTargetY);
  }
  
  return bestSymbols;
}

function collectFinalGrid(
  finalVisibleSymbols: any
) {
  const getSymbolValue = (symbol: any) => {
    return (symbol as any).userData?.symbolValue || 1;
  };
  
  const grid = [];
  for (let row = 0; row < SYMBOL_CONFIG.ROWS; row++) {
    for (let col = 0; col < SYMBOL_CONFIG.COLUMNS; col++) {
      grid.push(getSymbolValue(finalVisibleSymbols[col][row]));
    }
  }
  
  return grid;
}

export async function runStopPhase(
  config: any,
  reelContext: any
) {
  const { frameTime, spinSpeed, bottomBoundary, rowHeight } = config;
  const { reelSymbols, createNewSymbol } = reelContext;
  
  const { distances: columnTargetDistance, stopped: columnStopped } = 
    calculateStopDistances(reelContext, rowHeight);
  
  const finalVisibleSymbols: any = {};

  while (!columnStopped[0] || !columnStopped[1] || !columnStopped[2]) {
    for (let col = 0; col < SYMBOL_CONFIG.COLUMNS; col++) {
      if (columnStopped[col]) {
        continue;
      }
      
      moveColumn(reelSymbols[col], spinSpeed, bottomBoundary, rowHeight, createNewSymbol, col);
      columnTargetDistance[col] -= spinSpeed;
      
      if (columnTargetDistance[col] <= 0) {
        columnStopped[col] = true;
        finalVisibleSymbols[col] = alignColumnToGrid(col, reelContext);
      }
    }
    
    await new Promise((resolve) => setTimeout(resolve, frameTime));
  }

  const finalGrid = collectFinalGrid(finalVisibleSymbols);
  
  return { finalGrid, finalVisibleSymbols };
}

export function processWinResult(
  finalGrid: number[],
  finalVisibleSymbols: any,
  checkWin: (grid: number[]) => number
) {
  const winningRow = checkWin(finalGrid);
  const hasWin = winningRow !== -1;
  
  if (hasWin) {
    const winningSymbols = [];
    for (let col = 0; col < SYMBOL_CONFIG.COLUMNS; col++) {
      winningSymbols.push(finalVisibleSymbols[col][winningRow]);
    }
    pulseSymbols(winningSymbols, WIN_PULSE_ANIMATION.DURATION);
  }
  
  return hasWin;
}

