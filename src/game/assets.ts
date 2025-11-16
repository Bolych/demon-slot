import { Assets, Texture } from 'pixi.js';

interface GameAssets {
  background: Texture;
  board: Texture;
  symbols: {
    symbol1: Texture;
    symbol2: Texture;
    symbol3: Texture;
    symbol4: Texture;
    symbol5: Texture;
  };
  playButton: Texture;
  winInfo: Texture;
  logo: Texture;
}

let loadedAssets: GameAssets | null = null;

export async function loadGameAssets(): Promise<GameAssets> {
  if (loadedAssets) {
    return loadedAssets;
  }

  const [background, board, symbol1, symbol2, symbol3, symbol4, symbol5, playButton, winInfo, logo] =
    await Promise.all([
      Assets.load(`${import.meta.env.BASE_URL}assets/ui/bg-enigma-castle.webp`),
      Assets.load(`${import.meta.env.BASE_URL}assets/ui/board.webp`),
      Assets.load(`${import.meta.env.BASE_URL}assets/symbols/symbol-helmet.webp`),
      Assets.load(`${import.meta.env.BASE_URL}assets/symbols/symbol-fire.webp`),
      Assets.load(`${import.meta.env.BASE_URL}assets/symbols/shield.webp`),
      Assets.load(`${import.meta.env.BASE_URL}assets/symbols/demon.webp`),
      Assets.load(`${import.meta.env.BASE_URL}assets/symbols/sword.webp`),
      Assets.load(`${import.meta.env.BASE_URL}assets/ui/spin.webp`),
      Assets.load(`${import.meta.env.BASE_URL}assets/ui/win-info.webp`),
      Assets.load(`${import.meta.env.BASE_URL}assets/ui/logo-hunt-1.png`),
    ]);

  loadedAssets = {
    background,
    board,
    symbols: { symbol1, symbol2, symbol3, symbol4, symbol5 },
    playButton,
    winInfo,
    logo,
  };

  return loadedAssets;
}

