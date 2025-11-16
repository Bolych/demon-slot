<script lang="ts">
  import { onMount } from 'svelte';
  import { initializeGame } from './game/gameApp';

  let canvasContainer: HTMLDivElement;

  onMount(() => {
    (async () => {
      await initializeGame(canvasContainer);
    })();
  });
</script>

<main>
  <div class="game-container">
    <div bind:this={canvasContainer} class="canvas-container"></div>
  </div>
</main>

<style>
  main {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;
  }

  .game-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .canvas-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
