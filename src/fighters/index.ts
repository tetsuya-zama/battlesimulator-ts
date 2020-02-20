import {Fightable} from '../core';
import {Fighter ,FighterStatusData, isFighterStatusData, parseFighterStatus} from './fighter';
import {Chicken} from './chicken';

export interface FightableCreationRequest extends FighterStatusData{
  __type: string
}

export const isFighterCreationRequest = (obj: any): obj is FightableCreationRequest => {
  return typeof obj.__type === "string"
    && isFighterStatusData(obj);
}

export const createFighter = (obj: any): Fightable =>{
  if(isFighterCreationRequest(obj)){
    const status = parseFighterStatus(obj);
    switch(obj.__type){
      case "Fighter":
        return new Fighter(status);
      case "Chicken":
        return new Chicken(status);
      default:
        throw new Error(`Invalid type:${obj.__type}`);
    }
  }else{
    throw new Error(`Invalid parameter: ${JSON.stringify(obj)}`);
  }
}
