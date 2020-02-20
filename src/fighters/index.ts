import {Fightable} from '../core';
import {Fighter ,FighterStatusData, isFighterStatusData, parseFighterStatus} from './fighter';
import {Chicken} from './chicken';

/**
* [[Fightable]]作成要求のデータ型
*/
export interface FightableCreationRequest extends FighterStatusData{
  /** 作成したい[[Fightable]]の型*/
  __type: string
}

/**
* [[FightableCreationRequest]]のtype guard
* @param 判定したいオブジェクト
* @return objが[[FightableCreationRequest]]であればtrue
*/
export const isFighterCreationRequest = (obj: any): obj is FightableCreationRequest => {
  return typeof obj.__type === "string"
    && isFighterStatusData(obj);
}

/**
* [[Fightable]]のインスタンスを作成する
* @param obj 入力データ(JSONやYAMLなどの読み込み値)
* @return 作成された[[Fightable]]
*/
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
