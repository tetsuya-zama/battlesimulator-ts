import {Fighter,FighterStatus} from './fighter';
import {COMMAND} from '../core';

/**
* Chicken(臆病者)オブジェクト
* [[Fightable]]の一種
*/
export class Chicken extends Fighter{
  /**
  * コンストラクタ
  * @param status [[Fighter]]と同じく[[FighterStatus]]によってインスタンス化する
  */
  constructor(status: FighterStatus){
    super(status);
  }

  /**
  * [[COMMAND]]を選択する
  */
  chooseCommand(){
    /**
    * [[Fighter]]は50%の確率で攻撃するが、
    * [[Chicken]]は臆病なので10%の確率でしか攻撃しない
    */
    const chosen = Math.floor(Math.random() * 10);
    if(chosen === 0){
      this._currentCommand = COMMAND.ATTACK;
    }else{
      this._currentCommand = COMMAND.GUARD;
    }
  }
}
