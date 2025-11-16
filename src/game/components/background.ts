import { Sprite, Container } from 'pixi.js';
import { loadGameAssets } from '../assets';

export async function createBackground(screenWidth: number, screenHeight: number, stage: Container): Promise<void> {
  const assets = await loadGameAssets();
  const background = new Sprite(assets.background);
  
  background.width = screenWidth;
  background.height = screenHeight;
  
  stage.addChild(background);
}