import type { BattlePhase } from '../../types';
import { BattleSetupScreen } from './battle/BattleSetupScreen';
import { CollectionScreen } from './battle/CollectionScreen';
import { PassDeviceScreen } from './battle/PassDeviceScreen';
import { DragonSelectScreen } from './battle/DragonSelectScreen';
import { BattleScreen } from './battle/BattleScreen';
import { BattleVictoryScreen } from './battle/BattleVictoryScreen';

interface Props {
  phase: BattlePhase;
}

export function BattleGameScreen({ phase }: Props) {
  switch (phase) {
    case 'SETUP':            return <BattleSetupScreen />;
    case 'COLLECTION_P1':
    case 'COLLECTION_P2':   return <CollectionScreen />;
    case 'PASS_TO_P2':
    case 'PASS_TO_P1_SELECT': return <PassDeviceScreen phase={phase} />;
    case 'DRAGON_SELECT_P1':
    case 'DRAGON_SELECT_P2': return <DragonSelectScreen />;
    case 'BATTLE':          return <BattleScreen />;
    case 'VICTORY':         return <BattleVictoryScreen />;
    default:                return <BattleSetupScreen />;
  }
}
