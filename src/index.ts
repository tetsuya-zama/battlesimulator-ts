import {Battle, IntValue} from './core';
import {FightableCreationRequest, isFighterCreationRequest, createFighter} from './fighters';

/**
* BattleSimukatorの設定値のデータ型
* 設定用YAMLの型チェックに使用
*/
export interface BattleSimulatorSetting{
  /**先手の[[Fightable]]の設定値*/
  black: FightableCreationRequest
  /**後手の[[Fightable]]の設定値*/
  white: FightableCreationRequest
  /**最大ターン数(任意)*/
  maxTurn?: number
}

/**
* [[BattleSimulatorSetting]]のtype guard
* @param obj チェックしたいオブジェクト
* @return objが[[BattleSimulatorSetting]]であればtrue
*/
export const isBattleSimulatorSetting = (obj: any): obj is BattleSimulatorSetting => {
  return !!obj.black && isFighterCreationRequest(obj.black)
    && !!obj.white && isFighterCreationRequest(obj.white)
    && (obj.maxTurn === undefined || typeof obj.maxTurn === "number");
}

/**
* [[BattleSimulatorSetting]]から[[Battle]]のインスタンスを作成する
* @param setting 設定値
* @return 設定値を元に作成された[[Battle]]のインスタンス
*/
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
      /**
      * コマンドラインから実行されたときのみ関連モジュールを読み込む
      */
      const yaml: typeof Yaml = require('js-yaml');
      const fs: typeof Fs = require('fs');
      const settingFilePath = "./battlesimulator.yml";

      //設定ファイルのロード
      const setting = yaml.safeLoad(fs.readFileSync(settingFilePath, "utf-8"));

      if(isBattleSimulatorSetting(setting)){
        /**
        * 設定ファイルの内容チェックが通った場合
        */
        const battle = load(setting);　//[[Battle]]のインスタンスを作成

        /**
        * 戦闘が終わるまでログを出力しながら次のターンを実行し続ける
        */
        while(!battle.isFinished){
          battle.nextTurn().forEach(log => console.log(log));
        }
      }else{
        /**
        * 設定ファイルの内容に不備がある場合
        */
        throw new Error(`Invalid setting:${JSON.stringify(setting)}`);
      }
}
