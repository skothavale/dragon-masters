import { useGameStore } from './store/useGameStore';
import { useHatcheryStore } from './store/useHatcheryStore';
import { GameSelectScreen } from './components/screens/GameSelectScreen';
import { StartScreen } from './components/screens/StartScreen';
import { GameScreen } from './components/screens/GameScreen';
import { VictoryScreen } from './components/screens/VictoryScreen';
import { GameOverScreen } from './components/screens/GameOverScreen';
import { HatcheryStartScreen } from './components/screens/HatcheryStartScreen';
import { HatcheryGameScreen } from './components/screens/HatcheryGameScreen';
import { HatcheryVictoryScreen } from './components/screens/HatcheryVictoryScreen';

export default function App() {
  const currentGame = useGameStore(s => s.currentGame);
  const screen = useGameStore(s => s.screen);
  const hatcheryScreen = useHatcheryStore(s => s.screen);

  if (currentGame === 'SELECT') return <GameSelectScreen />;

  if (currentGame === 'STORM_CASTLE') {
    switch (screen) {
      case 'START': return <StartScreen />;
      case 'GAME': return <GameScreen />;
      case 'VICTORY': return <VictoryScreen />;
      case 'GAMEOVER': return <GameOverScreen />;
      default: return <StartScreen />;
    }
  }

  if (currentGame === 'HATCHERY') {
    switch (hatcheryScreen) {
      case 'START': return <HatcheryStartScreen />;
      case 'GAME': return <HatcheryGameScreen />;
      case 'VICTORY': return <HatcheryVictoryScreen />;
      default: return <HatcheryStartScreen />;
    }
  }

  return <GameSelectScreen />;
}
