import { Application } from 'pixi.js';
import { createLogo } from './components/logo';
import { createBackground } from './components/background';
import { createGameUI } from './components/gameUI';

export async function initializeGame(container: HTMLElement): Promise<Application> {
  const app = new Application();
  
  await app.init({
    resizeTo: window,
    backgroundColor: 0x000000,
  });

  container.appendChild(app.canvas);

  const { width: screenWidth, height: screenHeight } = app.screen;

  await createBackground(screenWidth, screenHeight, app.stage);
  await createGameUI(screenWidth, screenHeight, app.stage);
  await createLogo(screenWidth, app.stage);

  return app;
}

