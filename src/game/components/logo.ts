import { Sprite, Container } from 'pixi.js';
import { loadGameAssets } from '../assets';

export async function createLogo(screenWidth: number, stage: Container) {
  const assets = await loadGameAssets();
  
  const logo = new Sprite(assets.logo);
  logo.anchor.set(0.5);
  logo.x = screenWidth / 2;
  logo.y = 90;
  logo.scale.set(0.3);

  stage.addChild(logo);
}

