import {IntValue, COMMAND, Fightable, CommandLog} from "../core";

/**
* [[Fighter]]のステータスのデータ型
* JSONやYAMLなどTypeScript管理外データの構造チェックに利用する
*/
export interface FighterStatusData{
  /**名前*/
  readonly name: string
  /**ヒットポイント*/
  readonly hp: number
  /**攻撃力*/
  readonly offence: number
  /**防御力*/
  readonly deffence: number
}

/**
* [[FighterStatusData]]のtype guard
* @param obj チェックしたいオブジェクト
* @return objが[[FighterStatusData]]の要件を満たせばtrue
*/
export const isFighterStatusData = (obj: any): obj is FighterStatusData =>{
  return typeof obj.name === "string"
    && typeof obj.hp === "number"
    && typeof obj.offence === "number"
    && typeof obj.deffence === "number";
}

/**
* [[Fighter]]のステータス
*/
export interface FighterStatus{
  readonly name: string
  readonly hp: IntValue
  readonly offence: IntValue
  readonly deffence: IntValue
}

/**
* [[FighterStatusData]]から[[FighterStatus]]に変換する
* @param name 名前
* @param hp ヒットポイント
* @param offence 攻撃力
* @param defence 防御力
* @return 引数を元に作成された[[FighterStatus]]
*/
export const parseFighterStatus = ({name, hp, offence, deffence}: FighterStatusData): FighterStatus =>{
  return {
    name,
    hp:IntValue.of(hp),
    offence: IntValue.of(offence),
    deffence: IntValue.of(deffence)
  };
}

/**
* 「戦士」(Fighter)オブジェクト
* [[Fightable]]の基本型
*/
export class Fighter implements Fightable{
  /**名前*/
  private _name: string
  /**ヒットポイント*/
  private _hp: number
  /**攻撃力*/
  private _offence: number
  /**防御力*/
  private _deffence: number
  /**現在選択している[[COMMAND]]*/
  protected _currentCommand: COMMAND = COMMAND.ATTACK

　/**
  * 戦士の名前を返す
  */
  get name(){
    return this._name;
  }

  /**
  * 戦士が生きているかどうか
  */
  get alive(){
    return this._hp > 0;
  }

  /**
  * コンストラクタ
  * @param name 名前
  * @param hp ヒットポイント
  * @param offence 攻撃力
  * @param deffence 防御力
  */
  constructor({name,hp,offence,deffence}: FighterStatus){
    if(name.length === 0) throw new Error("名前に空文字は指定できません");
    if(hp.value <= 0) throw new Error(`HPは1以上の数値を指定してください:${hp.value}`);
    if(offence.value <= 0) throw new Error(`攻撃力は1以上の数値を指定してください:${offence.value}`);
    if(deffence.value <= 0) throw new Error(`防御力は1以上の数値を指定してください:${deffence.value}`);

    this._name = name;
    this._hp = hp.value;
    this._offence = offence.value;
    this._deffence = deffence.value;
  }

  /**
  * 現在の状態を[[CommandLog]]として返す
  * @return 現在の状態
  */
  describeCurrentStatus():CommandLog{
    return [`${this._name} HP:${this._hp}`];
  }

  /**
  * 攻撃力を返す
  * @return 攻撃力
  */
  protected get offence(){
    return this._offence;
  }

  /**
  * 防御力を返す
  * @return 防御力
  */
  protected get deffence(){
    return this._currentCommand === COMMAND.GUARD ? this._deffence * 2 : this._deffence;
  }

  /**
  * 現在選択している[[COMMAND]]を返す
  * @return 現在選択しているコマンド
  */
  getCurrentCommand():COMMAND{
    return this._currentCommand;
  }

  /**
  * 攻撃を受ける
  * @param damage 与えたいダメージ
  * @return 自身の防御力を加味した最終ダメージ(負の数なら回復)
  */
  hit(damage: IntValue): IntValue{
    const actualDamage = damage.value - this.deffence;
    this._hp -= actualDamage;
    return IntValue.of(actualDamage);
  }

  /**
  * 引数に与えられた[[Fightable]]を攻撃する
  * @param 攻撃される[[Fightable]]
  * @return 攻撃結果[[CommandLog]]
  */
  attack(enemy: Fightable):CommandLog{
    const actualDamage = enemy.hit(IntValue.of(this.offence));
    return [actualDamage.value >= 0 ? `${enemy.name}に${actualDamage.value}のダメージ` : `${enemy.name}は${actualDamage.value * -1}回復`]
  }
  
  /**
  * [[COMMAND]]を選択する
  */
  chooseCommand():void{
    const chosen = Math.floor(Math.random() * 2);
    if(chosen === 0){
      this._currentCommand = COMMAND.ATTACK;
    }else{
      this._currentCommand = COMMAND.GUARD;
    }
  }
}
