import {Fighter,FighterStatus} from './';
import {COMMAND} from '../core';

export class Chicken extends Fighter{
  constructor(status: FighterStatus){
    super(status);
  }

  chooseCommand(){
    const chosen = Math.floor(Math.random() * 10);
    if(chosen === 0){
      this._currentCommand = COMMAND.ATTACK;
    }else{
      this._currentCommand = COMMAND.GUARD;
    }
  }
}
