import {Battle, IntValue} from './core';
import {FighterCreationRequest, isFighterCreationRequest, createFighter} from './fighters';

export interface BattleSimulatorSetting{
  black: FighterCreationRequest
  white: FighterCreationRequest
  maxTurn?: number
}

export const isBattleSimulatorSetting = (obj: any): obj is BattleSimulatorSetting => {
  return !!obj.black && isFighterCreationRequest(obj.black)
    && !!obj.white && isFighterCreationRequest(obj.white)
    && (obj.maxTurn === undefined || typeof obj.maxTurn === "number");
}

export const load = (setting: BattleSimulatorSetting): Battle => {
  const black = createFighter(setting.black);
  const white = createFighter(setting.white);
  const maxTurn = !!setting.maxTurn ? IntValue.of(setting.maxTurn) : undefined;

  return new Battle({black, white, maxTurn});
}



import Yaml from 'js-yaml';
import Fs from 'fs';

/**
* このindex.jsがコマンドラインから実行された場合
*/
/* istanbul ignore next */
if(require.main === module){
      const yaml: typeof Yaml = require('js-yaml');
      const fs: typeof Fs = require('fs');
      const settingFilePath = "./battlesimulator.yml";

      const setting = yaml.safeLoad(fs.readFileSync(settingFilePath, "utf-8"));

      if(isBattleSimulatorSetting(setting)){
        const battle = load(setting);
        while(!battle.isFinished){
          battle.nextTurn().forEach(log => console.log(log));
        }
      }else{
        throw new Error(`Invalid setting:${JSON.stringify(setting)}`);
      }
}
